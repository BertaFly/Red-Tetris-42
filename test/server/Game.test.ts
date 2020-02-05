import { ADD_PLAYER, DEL_PLAYER, Game, MOVE_PIECE, START_GAME, EnumActionRoomStore } from '../../src/server/Game';
import { ENUM_PIECES_MOVE } from '../../src/common/grid-piece-handler';
import { IPlayer } from '../../src/common/ITypeRoomManager';
import { ENUM_SOCKET_EVENT_CLIENT, IEventClientSetError, EnumError } from '../../src/common/socketEventClient';

const roomName = 'test';
let game: any = undefined;
let socket: any = undefined;
const user = {
  playerName: 'playerName',
  socket,
  type: EnumActionRoomStore.ADD_PLAYER,
}

beforeEach(() => {
  game = new Game(roomName);

  socket = {
    emit: jest.fn((...arg: any[]) => { }),
    id: '123',
  };
})

afterEach(() => {
  game.unsubscribe();
})

it('ADD_PLAYER', () => {

  game.dispatch(ADD_PLAYER(user.playerName, socket));

  expect(game.state.players.some((pl: IPlayer) => pl.playerName === user.playerName)).toBe(true);

  expect(ADD_PLAYER(user.playerName, user.socket)).toHaveProperty("playerName");

  // add same player name
  game.dispatch(ADD_PLAYER(user.playerName, socket));
  const socketErrDuplicateName: IEventClientSetError = {
    error_type: EnumError.PLAYER_SAME_NAME,
    msg: 'A player has already this name in this room',
  };
  expect(socket.emit.mock.calls).toContainEqual([ENUM_SOCKET_EVENT_CLIENT.SET_ERROR, socketErrDuplicateName]);

  // add player to ongoing game
  game.dispatch(START_GAME())
  game.dispatch(ADD_PLAYER('bertaFly', socket));
  const socketErrGameOn: IEventClientSetError = {
    error_type: EnumError.PLAYING,
    msg: 'You are not allowed to join the game in progress. Please select another room or try later',
  };
  expect(socket.emit.mock.calls).toContainEqual([ENUM_SOCKET_EVENT_CLIENT.SET_ERROR, socketErrGameOn]);
});

it('DEL_PLAYER', () => {
  game.dispatch(ADD_PLAYER(user.playerName, socket));
  expect(DEL_PLAYER(socket.id)).toHaveProperty('type');

  game.dispatch(DEL_PLAYER('qwerty'));
  game.dispatch(DEL_PLAYER(socket.id));

  expect(game.state.players).toHaveLength(0);

  const socket2: any = {
    emit: (...arg: any[]) => { },
    id: '321',
  }
  game.dispatch(ADD_PLAYER(user.playerName, socket));
  game.dispatch(ADD_PLAYER('playerName2', socket2));
  game.dispatch(DEL_PLAYER(socket.id));
  expect(game.state.players).toHaveLength(1);
});

it('START_GAME', () => {
  game.dispatch(START_GAME());

  const startGameActionObject = {
    type: EnumActionRoomStore.START_GAME
  }
  expect(START_GAME()).toStrictEqual(startGameActionObject);
  expect(game.state.playing).toBe(true);
});

it('MOVE_PIECE', () => {
  const mooveDownActionObject = {
    type: EnumActionRoomStore.MOVE_PIECE,
    socketId: socket.id,
    move: ENUM_PIECES_MOVE.DOWN,
  }
  expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DOWN)).toStrictEqual(mooveDownActionObject);
  const prevState = game.state
  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DOWN));
  expect(game.state !== prevState).toBe(true);

  const mooveLeftActionObject = {
    type: EnumActionRoomStore.MOVE_PIECE,
    socketId: socket.id,
    move: ENUM_PIECES_MOVE.LEFT,
  }
  expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.LEFT)).toStrictEqual(mooveLeftActionObject);

  const mooveRightActionObject = {
    type: EnumActionRoomStore.MOVE_PIECE,
    socketId: socket.id,
    move: ENUM_PIECES_MOVE.RIGHT,
  }
  expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.RIGHT)).toStrictEqual(mooveRightActionObject);

  const mooveDropActionObject = {
    type: EnumActionRoomStore.MOVE_PIECE,
    socketId: socket.id,
    move: ENUM_PIECES_MOVE.DROP,
  }
  expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DROP)).toStrictEqual(mooveDropActionObject);

  const mooveSwitchActionObject = {
    type: EnumActionRoomStore.MOVE_PIECE,
    socketId: socket.id,
    move: ENUM_PIECES_MOVE.SWITCH,
  }
  expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.SWITCH)).toStrictEqual(mooveSwitchActionObject);

  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.RIGHT));
  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.LEFT));
  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.ROT_RIGHT));
  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.SWITCH));
  game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DROP));
});

it('Unknow action', () => {
  const prevState = game.state
  game.dispatch((() => ({ type: 'UNKNOWN_ACTION' })));
  expect(prevState).toStrictEqual(game.state);
})

it('game other', () => {
  // check constructor with room name
  expect(game.state.roomName).toBe(roomName);

  // check state with no players
  expect(game.nbPlayer()).toBe(0);
  expect(game.hasSocketId(socket.id)).toBe(false);

  // check state after player joined
  game.dispatch(ADD_PLAYER(user.playerName, socket));
  expect(game.nbPlayer()).toBe(1);
  expect(game.hasSocketId(socket.id)).toBe(true);
});
