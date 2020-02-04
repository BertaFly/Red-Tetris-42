import { Socket } from 'socket.io';
import { BehaviorSubject, Subscription } from 'rxjs';

import { GamesDispatcher } from '@src/server/GamesDispatcher';
import { ADD_PLAYER, DEL_PLAYER, START_GAME, MOVE_PIECE } from '@src/server/Game';

import {
  ENUM_SOCKET_EVENT_SERVER,
  IEventServerSubRoomsPlayersName,
  IEventServerJoinRoom,
  IEventServerQuitRoom,
  IEventServerUnSubRoomsPlayersName,
  IEventServerStartGame,
  IEventServerMovePiece
} from '@src/common/socketEventServer';
import { IRoomPlayersName, IEventClientSetRoomsPlayersName, ENUM_SOCKET_EVENT_CLIENT } from '@src/common/socketEventClient';

const gamesDispatcher = new GamesDispatcher();
const roomsPlayersNameSub: BehaviorSubject<IRoomPlayersName[]> = new BehaviorSubject<IRoomPlayersName[]>([]);

const handleClient = (socket: Socket) => {
  let subRoomsPlayersName: Subscription | undefined = undefined;

  socket.on(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, (arg: IEventServerJoinRoom) => {
    console.log(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);

    gamesDispatcher.dispatch({
      roomName: arg.roomName,
      actionRoom: ADD_PLAYER(arg.playerName, socket),
    });
  });

  socket.on(ENUM_SOCKET_EVENT_SERVER.SUB_ROOMS_PLAYERS_NAME, (arg: IEventServerSubRoomsPlayersName) => {
    console.log(ENUM_SOCKET_EVENT_SERVER.SUB_ROOMS_PLAYERS_NAME, arg);

    if (subRoomsPlayersName && !subRoomsPlayersName.closed) {
      return
    }

    subRoomsPlayersName = roomsPlayersNameSub.subscribe((roomsPlayersName: IRoomPlayersName[]) => {
      const sendSetRoomsPlayersName = (sock: Socket, ag: IEventClientSetRoomsPlayersName) => {
        sock.emit(ENUM_SOCKET_EVENT_CLIENT.SET_ROOMS_PLAYERS_NAME, ag);
      };

      sendSetRoomsPlayersName(socket, {
        roomsPlayersName: roomsPlayersName,
      });
    });
  })

  socket.on(ENUM_SOCKET_EVENT_SERVER.UN_SUB_ROOMS_PLAYERS_NAME, (arg: IEventServerUnSubRoomsPlayersName) => {
    if (subRoomsPlayersName !== undefined) {
      subRoomsPlayersName.unsubscribe();
    }
  });

  socket.on(ENUM_SOCKET_EVENT_SERVER.QUIT_ROOM, (arg: IEventServerQuitRoom) => {
    console.log(ENUM_SOCKET_EVENT_SERVER.QUIT_ROOM, arg);

    gamesDispatcher.dispatch({
      socketId: socket.id,
      actionRoom: DEL_PLAYER(socket.id),
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);

    gamesDispatcher.dispatch({
      socketId: socket.id,
      actionRoom: DEL_PLAYER(socket.id),
    });

    if (subRoomsPlayersName !== undefined) {
      subRoomsPlayersName.unsubscribe();
    }

    socket.removeAllListeners();
    socket.disconnect(true);
  });

  socket.on(ENUM_SOCKET_EVENT_SERVER.START_GAME, (arg: IEventServerStartGame) => {
    console.log(ENUM_SOCKET_EVENT_SERVER.START_GAME, arg);

    gamesDispatcher.dispatch({
      roomName: arg.roomName,
      actionRoom: START_GAME(),
    });
  })

  socket.on(ENUM_SOCKET_EVENT_SERVER.MOVE_PIECE, (arg: IEventServerMovePiece) => {
    const { roomName, move } = arg
    gamesDispatcher.dispatch({
      roomName,
      actionRoom: MOVE_PIECE(socket.id, move),
    })
  })
}

setInterval(() => {
  roomsPlayersNameSub.next(
    gamesDispatcher.games.map((r) => ({
      roomName: r.state.roomName,
      playerNames: r.state.players.map((p) => p.playerName),
    }),
    ),
  );
}, 1000);

export { handleClient }
