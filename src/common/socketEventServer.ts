import { ENUM_PIECES_MOVE } from './grid-piece-handler';

// JOIN_ROOM
interface IEventServerJoinRoom {
  roomName: string,

  playerName: string,
}

// QUIT_ROOM
interface IEventServerQuitRoom {
  roomName: string,

  playerName: string,
}

// SUB_ROOMS_PLAYERS_NAME
interface IEventServerSubRoomsPlayersName {
}

// UN_SUB_ROOMS_PLAYERS_NAME
interface IEventServerUnSubRoomsPlayersName {
}

// START_GAME
interface IEventServerStartGame {
  roomName: string,
}

// IEventServerMovePiece

interface IEventServerMovePiece {
  roomName: string
  move: ENUM_PIECES_MOVE
}

enum ENUM_SOCKET_EVENT_SERVER {
  JOIN_ROOM = 'JOIN_ROOM',
  QUIT_ROOM = 'QUIT_ROOM',
  SUB_ROOMS_PLAYERS_NAME = 'SUB_ROOMS_PLAYERS_NAME',
  UN_SUB_ROOMS_PLAYERS_NAME = 'UN_SUB_ROOMS_PLAYERS_NAME',
  SET_GAME_OPTION = 'SET_GAME_OPTION',
  START_GAME = 'START_GAME',
  MOVE_PIECE = 'MOVE_PIECE',
}

export {
  ENUM_SOCKET_EVENT_SERVER,
  IEventServerJoinRoom,
  IEventServerStartGame,
  IEventServerSubRoomsPlayersName,
  IEventServerQuitRoom,
  IEventServerUnSubRoomsPlayersName,
  IEventServerMovePiece,
};
