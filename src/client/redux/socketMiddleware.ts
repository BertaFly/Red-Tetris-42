import { EnumAction, ReduxAction } from './actions/action-creators';
import {
  ENUM_SOCKET_EVENT_SERVER,
  IEventServerJoinRoom,
  IEventServerStartGame, IEventServerSubRoomsPlayersName, IEventServerQuitRoom, IEventServerUnSubRoomsPlayersName, IEventServerMovePiece
} from '@src/common/socketEventServer';
import { IDataState } from "@src/client/redux/reducer";

const isPlaying = (state: IDataState): boolean => {
  const { playerName, roomState } = state
  if (!playerName || !roomState) {
    return false;
  }

  const player = roomState.players.find((p) => p.playerName === playerName);

  return player ? player.playing : false;
};

const sendJoinRoom = (socket: SocketIOClient.Socket, arg: IEventServerJoinRoom) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);
};

const sendQuitRoom = (socket: SocketIOClient.Socket, arg: IEventServerQuitRoom) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.QUIT_ROOM, arg);
};

const sendSubRoomsPlayersName = (socket: SocketIOClient.Socket, arg: IEventServerSubRoomsPlayersName) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.SUB_ROOMS_PLAYERS_NAME, arg);
};

const sendUnSubRoomsPlayersName = (socket: SocketIOClient.Socket, arg: IEventServerUnSubRoomsPlayersName) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.UN_SUB_ROOMS_PLAYERS_NAME, arg);
};

const sendStartGame = (socket: SocketIOClient.Socket, arg: IEventServerStartGame): void => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.START_GAME, arg);
};

const sendRoomPlayerName = (socket: SocketIOClient.Socket, arg: IEventServerJoinRoom) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);
};

const sendMovePiece = (socket: SocketIOClient.Socket, arg: IEventServerMovePiece) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.MOVE_PIECE, arg)
}

const socketMiddleware = (store: any) => (next: any) => (action: ReduxAction) => {

  const state: IDataState = store.getState();

  switch (action.type) {
    case EnumAction.SEND_ROOM_PLAYER_NAME:
      if (state.socket !== undefined
        && state.roomName !== undefined
        && state.playerName !== undefined
      ) {
        sendRoomPlayerName(state.socket, {
          roomName: state.roomName,
          playerName: state.playerName,
        });
      }
      break;
    case EnumAction.SEND_START_GAME:
      if (state.socket !== undefined && state.roomName !== undefined) {
        sendStartGame(state.socket, {
          roomName: state.roomName,
        });
      }
      break;
    case EnumAction.SEND_JOIN_ROOM:
      if (state.socket !== undefined) {
        sendJoinRoom(state.socket, {
          playerName: action.playerName,
          roomName: action.roomName,
        });
      }
      break;
    case EnumAction.SEND_QUIT_ROOM:
      if (state.socket !== undefined
        && state.roomName !== undefined
        && state.playerName !== undefined
      ) {
        sendQuitRoom(state.socket, {
          playerName: state.playerName,
          roomName: state.roomName,
        });
      }
      break;
    case EnumAction.SEND_SUB_ROOMS_PLAYERS_NAME:
      if (state.socket !== undefined) {
        sendSubRoomsPlayersName(state.socket, {});
      }
      break;
    case EnumAction.SEND_UN_SUB_ROOMS_PLAYERS_NAME:
      if (state.socket !== undefined) {
        sendUnSubRoomsPlayersName(state.socket, {});
      }
      break;
    case EnumAction.SEND_MOVE_PIECE:
      if (state.socket !== undefined && state.roomName !== undefined && isPlaying(state)) {
        const { roomName } = state
        const { move } = action
        sendMovePiece(state.socket, {
          roomName,
          move,
        })
      }
      break;
    default:
      break;
  }

  return next(action);
};

export { socketMiddleware };
