import { Socket } from 'socket.io';
import { BehaviorSubject, Subscription } from 'rxjs';
import Timeout = NodeJS.Timeout;

import { Player } from '@src/server/Player';

import {
  GRID_HEIGHT, initPose, gridInit, ENUM_PIECES_MOVE, ENUM_PIECES, moveHandler
} from '@src/common/grid-piece-handler';

import { IRoomState } from '@src/common/ITypeRoomManager';
import {
  ENUM_SOCKET_EVENT_CLIENT,
  IEventClientSetRoomState,
  IEventClientSetError,
  EnumError,
} from '@src/common/socketEventClient';
import { updateWin } from './updateWin';
import { Piece } from './Piece';

// -- ACTION

enum EnumActionRoomStore {
  ADD_PLAYER,
  DEL_PLAYER,
  START_GAME,
  MOVE_PIECE,
}

interface IActionRoom {
  readonly type: EnumActionRoomStore;
}

// ADD_PLAYER

interface IActionRoomAddPlayer extends IActionRoom {
  readonly type: EnumActionRoomStore.ADD_PLAYER;

  readonly playerName: string;
  readonly socket: Socket;
}

const ADD_PLAYER = (playerName: string, socket: Socket): IActionRoomAddPlayer => {
  return {
    type: EnumActionRoomStore.ADD_PLAYER,
    playerName,
    socket,
  };
};

const reducerAddPlayer = (
  state: IRoomState,
  action: IActionRoomAddPlayer,
): IRoomState => {

  const { playerName, socket } = action;
  const { players, playing } = state

  if (playing) {
    const toSend: IEventClientSetError = {
      error_type: EnumError.PLAYER_SAME_NAME,
      msg: 'You are not allowed to join the game in progress. Please select another room or try later',
    };

    socket.emit(ENUM_SOCKET_EVENT_CLIENT.SET_ERROR, toSend);
    return state;
  }

  const hasPlayerName = players.some((p) => p.playerName === playerName);
  if (hasPlayerName) {
    const toSend: IEventClientSetError = {
      error_type: EnumError.PLAYER_SAME_NAME,
      msg: 'A player has already this name in this room',
    };

    socket.emit(ENUM_SOCKET_EVENT_CLIENT.SET_ERROR, toSend);
    return state;
  }

  socket.emit(ENUM_SOCKET_EVENT_CLIENT.CLEAR_ERROR)

  const isMaster = state.players.length === 0;
  const player = Player.newPlayer(playerName, socket, isMaster, GRID_HEIGHT);

  return {
    ...state,
    players: [...state.players, {
      ...player,
    },
    ],
  };
};

// DEL_PLAYER

interface IActionRoomDelPlayer extends IActionRoom {
  readonly type: EnumActionRoomStore.DEL_PLAYER;

  readonly socket: string;
}

const DEL_PLAYER = (socket: string): IActionRoomDelPlayer => {
  return {
    type: EnumActionRoomStore.DEL_PLAYER,
    socket,
  };
};

const reducerDelPlayer = (
  state: IRoomState,
  action: IActionRoomDelPlayer,
): IRoomState => {

  const { socket } = action;

  let players = state.players.filter((p) => p.socket.id !== socket);

  if (players.length > 0) {
    if (!players.some((p) => p.isMaster)) {
      const [frst, ...rest] = players;
      players = [{ ...frst, isMaster: true }, ...rest];
    }

    players = updateWin(players);
  }

  return {
    ...state,
    playing: players.some((p) => p.playing),
    players: players,
  };
};

// START_GAME

interface IActionStartGame extends IActionRoom {
  readonly type: EnumActionRoomStore.START_GAME;
}

const START_GAME = (): IActionStartGame => {
  return {
    type: EnumActionRoomStore.START_GAME
  }
}

const reducerStartGame = (state: IRoomState): IRoomState => {
  const flow = Piece.genFlow(20);

  return {
    ...state,
    playing: true,
    players: state.players.map((p) => ({
      ...p,
      playing: true,
      isSpectator: false,
      flow: flow,
      win: false,
      lost: false,
      score: 0,
      nbLineCompleted: 0,
      posPiece: initPose(),
      grid: gridInit(),
    })),
  };
}

// MOVE_PIECE

interface IActionMovePiece extends IActionRoom {
  readonly type: EnumActionRoomStore.MOVE_PIECE;

  readonly socketId: string,
  readonly move: ENUM_PIECES_MOVE,
}

const MOVE_PIECE = (socketId: string, move: ENUM_PIECES_MOVE): IActionMovePiece => {
  return {
    type: EnumActionRoomStore.MOVE_PIECE,

    socketId,
    move,
  };
};

const reducerMovePiece = (state: IRoomState, action: IActionMovePiece): IRoomState => {
  const { move, socketId } = action;

  let newplayers = moveHandler(state.players, move, socketId);

  // update player lost
  newplayers = newplayers.map((p) => {
    if (p.grid[3].some((pi) => pi !== ENUM_PIECES.empty)) {
      return {
        ...p,
        playing: false,
        gameOver: true,
      };
    }
    return p;
  });

  // update player win
  newplayers = updateWin(newplayers);

  // add flow if need
  if (newplayers.some((p) => p.flow.length < 9)) {
    const flowToAdd = Piece.genFlow(20);

    newplayers = state.players.map((p) => ({ ...p, flow: [...p.flow, ...flowToAdd] }));
  }

  return {
    ...state,
    players: newplayers,
    playing: newplayers.some((p) => p.playing),
  };
}

// -- ACTION ROOM

type ActionRoom = IActionRoomAddPlayer | IActionRoomDelPlayer | IActionStartGame | IActionMovePiece

// -- REDUCER

const reducer = (state: IRoomState, action: ActionRoom): IRoomState => {
  switch (action.type) {
    case EnumActionRoomStore.ADD_PLAYER:
      return reducerAddPlayer(state, action);
    case EnumActionRoomStore.DEL_PLAYER:
      return reducerDelPlayer(state, action);
    case EnumActionRoomStore.START_GAME:
      return reducerStartGame(state);
    case EnumActionRoomStore.MOVE_PIECE:
      return reducerMovePiece(state, action);
    default:
      return state;
  }
};

class Game {
  state: IRoomState;
  stateSub: BehaviorSubject<IRoomState>;
  sub: Subscription;
  intervalDownPiece: Timeout;

  constructor(roomName: string) {
    const sendSetRoomState = (socket: Socket, arg: IEventClientSetRoomState) => {
      socket.emit(ENUM_SOCKET_EVENT_CLIENT.SET_ROOM_STATE, arg);
    };

    this.state = {
      roomName: roomName,
      players: [],
      playing: false,
    };

    this.stateSub = new BehaviorSubject<IRoomState>(this.state);

    this.sub = this.stateSub.subscribe((state: IRoomState) => {
      const ToSend = {
        room: {
          ...state,
          players: state.players.map((pl) => ({
            ...pl,
            socket: undefined,
          })),
        },
      };

      state.players.forEach((p) => {
        sendSetRoomState(p.socket, ToSend);
      });
    });

    this.intervalDownPiece = setInterval(() => {
      this.state.players.forEach((p) => {
        if (p.playing) {
          this.dispatch(MOVE_PIECE(p.socket.id, ENUM_PIECES_MOVE.DOWN));
        }
      });
    }, 500);
  }

  public dispatch(action: ActionRoom): void {
    const newState = reducer(this.state, action);

    if (newState !== this.state) {
      this.state = newState;
      this.stateSub.next(this.state);
    }
  }

  public hasSocketId(socketId: string): boolean {
    return this.state.players.some((p) => p.socket.id === socketId);
  }

  public nbPlayer(): number {
    return this.state.players.length;
  }

  public unsubscribe(): void {
    this.sub.unsubscribe();
    clearInterval(this.intervalDownPiece);
  }

}

export {
  Game,
  ActionRoom,
  ADD_PLAYER,
  DEL_PLAYER,
  START_GAME,
  MOVE_PIECE,
};
