import { ENUM_PIECES, IPiece, IPos } from '@src/common/grid-piece-handler';

interface IPlayerClient {
  readonly playerName: string;
  readonly isSpectator: boolean;
  readonly grid: ENUM_PIECES[][];
  readonly score: number;
  readonly nbLineCompleted: number;
  readonly playing: boolean;
  readonly win: boolean;
  readonly lost: boolean;
  readonly flow: IPiece[];
  readonly posPiece: IPos;
  readonly isMaster: boolean;
}

interface IRoomStateClient {
  readonly roomName: string;
  readonly playing: boolean;
  readonly players: IPlayerClient[];
}

// SET_ERROR
enum EnumError {
  PLAYER_SAME_NAME,
}

interface IEventClientSetError {
  readonly error_type: EnumError,
  readonly msg: string,
}

interface IEventClientSetRoomState {
  readonly room: IRoomStateClient
}

enum ENUM_SOCKET_EVENT_CLIENT {
  SET_ROOM_STATE = 'SET_ROOM_STATE',
  SET_ROOMS_PLAYERS_NAME = 'SET_ROOMS_PLAYERS_NAME',
  SET_ERROR = 'SET_ERROR',
}

// SET_ROOMS_PLAYERS_NAME
interface IRoomPlayersName {
  readonly roomName: string,
  readonly playerNames: string[],
}

interface IEventClientSetRoomsPlayersName {
  readonly roomsPlayersName: IRoomPlayersName[]
}

export {
  ENUM_SOCKET_EVENT_CLIENT,
  EnumError,
  IEventClientSetRoomState,
  IEventClientSetError,
  IEventClientSetRoomsPlayersName,
  IRoomPlayersName,
  IRoomStateClient,
  IPlayerClient,
};
