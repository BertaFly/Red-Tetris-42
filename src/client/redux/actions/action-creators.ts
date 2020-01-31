import {
  IEventClientSetError,
  IEventClientSetRoomsPlayersName,
  IEventClientSetRoomState,
} from '@src/common/socketEventClient';
import { ENUM_PIECES_MOVE } from '@src/common/grid-piece-handler';

interface IAction {
  readonly type: EnumAction
}

// ON_SET_ERROR

interface IOnSetError extends IAction {
  readonly type: EnumAction.ON_SET_ERROR
  readonly arg: IEventClientSetError
}

const ON_SET_ERROR = (arg: IEventClientSetError): IOnSetError => {
  return {
    type: EnumAction.ON_SET_ERROR,
    arg: arg,
  };
};

// ON_CLEAR_ERROR

interface IOnClearError extends IAction {
  readonly type: EnumAction.ON_CLEAR_ERROR
}

const ON_CLEAR_ERROR = (): IOnClearError => {
  return {
    type: EnumAction.ON_CLEAR_ERROR,
  };
};

// ON_SET_ROOM_STATE

interface IOnSetRoomeState extends IAction {
  readonly type: EnumAction.ON_SET_ROOM_STATE
  readonly arg: IEventClientSetRoomState
}

const ON_SET_ROOM_STATE = (arg: IEventClientSetRoomState): IOnSetRoomeState => {
  return {
    type: EnumAction.ON_SET_ROOM_STATE,
    arg: arg,
  };
};

// ON_SET_ROOMS_PLAYERS_NAME

interface IOnSetRoomesPlayersName extends IAction {
  readonly type: EnumAction.ON_SET_ROOMS_PLAYERS_NAME
  readonly arg: IEventClientSetRoomsPlayersName
}

const ON_SET_ROOMS_PLAYERS_NAME = (arg: IEventClientSetRoomsPlayersName): IOnSetRoomesPlayersName => {
  return {
    type: EnumAction.ON_SET_ROOMS_PLAYERS_NAME,
    arg: arg,
  };
};

// REFRESH

interface IRefresh {
  readonly type: EnumAction.REFRESH,
}

const REFRESH = (): IRefresh => {
  return {
    type: EnumAction.REFRESH,
  };
};

// SEND_ROOM_PLAYER_NAME

interface ISendRoomPlayerName {
  readonly type: EnumAction.SEND_ROOM_PLAYER_NAME,
}

const SEND_ROOM_PLAYER_NAME = (): ISendRoomPlayerName => {
  return {
    type: EnumAction.SEND_ROOM_PLAYER_NAME,
  };
};

// SEND_START_GAME

interface ISendStartGame extends IAction {
  readonly type: EnumAction.SEND_START_GAME,
}

const SEND_START_GAME = (): ISendStartGame => {
  return {
    type: EnumAction.SEND_START_GAME,
  };
};

// SEND_JOIN_ROOM

interface ISendJoinRoom {
  readonly type: EnumAction.SEND_JOIN_ROOM,

  readonly playerName: string,
  readonly roomName: string,
}

const SEND_JOIN_ROOM = (playerName: string, roomName: string): ISendJoinRoom => {
  return {
    type: EnumAction.SEND_JOIN_ROOM,

    playerName,
    roomName,
  };
};

// SEND_QUIT_ROOM

interface ISendQuitRoom {
  readonly type: EnumAction.SEND_QUIT_ROOM,
}

const SEND_QUIT_ROOM = (): ISendQuitRoom => {
  return {
    type: EnumAction.SEND_QUIT_ROOM,
  };
};

// SEND_SUB_ROOMS_PLAYERS_NAME

interface ISendSubRoomsPlayersName {
  readonly type: EnumAction.SEND_SUB_ROOMS_PLAYERS_NAME,
}

const SEND_SUB_ROOMS_PLAYERS_NAME = (): ISendSubRoomsPlayersName => {
  return {
    type: EnumAction.SEND_SUB_ROOMS_PLAYERS_NAME,
  };
};

// SEND_UN_SUB_ROOMS_PLAYERS_NAME

interface ISendUnSubRoomsPlayersName {
  readonly type: EnumAction.SEND_UN_SUB_ROOMS_PLAYERS_NAME,
}

const SEND_UN_SUB_ROOMS_PLAYERS_NAME = (): ISendUnSubRoomsPlayersName => {
  return {
    type: EnumAction.SEND_UN_SUB_ROOMS_PLAYERS_NAME,
  };
};

// SEND_MOVE_PIECE

interface ISendMovePiece extends IAction {
  readonly type: EnumAction.SEND_MOVE_PIECE,
  readonly move: ENUM_PIECES_MOVE,
}

const SEND_MOVE_PIECE = (move: ENUM_PIECES_MOVE): ISendMovePiece => ({
  type: EnumAction.SEND_MOVE_PIECE,
  move,
})

enum EnumAction {
  ON_SET_ROOM_STATE,
  ON_SET_ROOMS_PLAYERS_NAME,
  ON_SET_ERROR,
  ON_CLEAR_ERROR,
  SEND_ROOM_PLAYER_NAME,
  SEND_JOIN_ROOM,
  SEND_QUIT_ROOM,
  SEND_START_GAME,
  SEND_SUB_ROOMS_PLAYERS_NAME,
  SEND_UN_SUB_ROOMS_PLAYERS_NAME,
  REFRESH,
  SEND_MOVE_PIECE,
}

type ReduxAction = IOnSetRoomeState
  | IOnSetRoomesPlayersName
  | IRefresh
  | IOnSetError
  | ISendRoomPlayerName
  | ISendStartGame
  | ISendJoinRoom
  | ISendQuitRoom
  | ISendUnSubRoomsPlayersName
  | ISendSubRoomsPlayersName
  | ISendMovePiece
  | IOnClearError

export {
  EnumAction,
  ReduxAction,
  ON_SET_ROOM_STATE,
  ON_SET_ROOMS_PLAYERS_NAME,
  REFRESH,
  ON_SET_ERROR,
  ON_CLEAR_ERROR,
  SEND_ROOM_PLAYER_NAME,
  SEND_START_GAME,
  SEND_JOIN_ROOM,
  SEND_QUIT_ROOM,
  SEND_SUB_ROOMS_PLAYERS_NAME,
  SEND_UN_SUB_ROOMS_PLAYERS_NAME,
  SEND_MOVE_PIECE,
};
