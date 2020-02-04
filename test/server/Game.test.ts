import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ADD_PLAYER, DEL_PLAYER, Game, MOVE_PIECE, START_GAME, EnumActionRoomStore } from '../../src/server/Game';
import { ENUM_PIECES_MOVE } from '../../src/common/grid-piece-handler';
import { IPlayer } from '../../src/common/ITypeRoomManager';

describe('Game class', () => {
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
      emit: (...arg: any[]) => { },
      id: '123',
    };
  })

  afterEach(() => {
    game.unsubscribe();
  })

  it('ADD_PLAYER', () => {

    game.dispatch(ADD_PLAYER(user.playerName, socket));

    expect(game.state.players.some((pl: IPlayer) => pl.playerName === user.playerName)).to.eql(true);

    expect(ADD_PLAYER(user.playerName, user.socket)).to.have.keys(Object.keys(user));
  });

  it('DEL_PLAYER', () => {
    game.dispatch(ADD_PLAYER(user.playerName, socket));
    expect(DEL_PLAYER(socket.id)).to.have.keys(['type', 'socket']);

    game.dispatch(DEL_PLAYER('qwerty'));
    game.dispatch(DEL_PLAYER(socket.id));

    expect(game.state.players).to.have.length(0);

    const socket2: any = {
      emit: (...arg: any[]) => { },
      id: '321',
    }
    game.dispatch(ADD_PLAYER(user.playerName, socket));
    game.dispatch(ADD_PLAYER('playerName2', socket2));
    game.dispatch(DEL_PLAYER(socket.id));
    expect(game.state.players).to.have.length(1);
  });

  it('START_GAME', () => {
    game.dispatch(START_GAME());

    const startGameActionObject = {
      type: EnumActionRoomStore.START_GAME
    }
    expect(START_GAME()).to.eql(startGameActionObject);
    expect(game.state.playing).to.eql(true);
  });

  it('MOVE_PIECE', () => {
    const mooveDownActionObject = {
      type: EnumActionRoomStore.MOVE_PIECE,
      socketId: socket.id,
      move: ENUM_PIECES_MOVE.DOWN,
    }
    expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DOWN)).to.eql(mooveDownActionObject);
    const prevState = game.state
    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DOWN));
    expect(game.state !== prevState).to.equal(true);

    const mooveLeftActionObject = {
      type: EnumActionRoomStore.MOVE_PIECE,
      socketId: socket.id,
      move: ENUM_PIECES_MOVE.LEFT,
    }
    expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.LEFT)).to.eql(mooveLeftActionObject);

    const mooveRightActionObject = {
      type: EnumActionRoomStore.MOVE_PIECE,
      socketId: socket.id,
      move: ENUM_PIECES_MOVE.RIGHT,
    }
    expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.RIGHT)).to.eql(mooveRightActionObject);

    const mooveDropActionObject = {
      type: EnumActionRoomStore.MOVE_PIECE,
      socketId: socket.id,
      move: ENUM_PIECES_MOVE.DROP,
    }
    expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DROP)).to.eql(mooveDropActionObject);

    const mooveSwitchActionObject = {
      type: EnumActionRoomStore.MOVE_PIECE,
      socketId: socket.id,
      move: ENUM_PIECES_MOVE.SWITCH,
    }
    expect(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.SWITCH)).to.eql(mooveSwitchActionObject);

    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.RIGHT));
    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.LEFT));
    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.ROT_RIGHT));
    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.SWITCH));
    game.dispatch(MOVE_PIECE(socket.id, ENUM_PIECES_MOVE.DROP));
  });

  it('game other', () => {
    // check constructor with room name
    expect(game.state.roomName).to.eql(roomName);

    // check state with no players
    expect(game.nbPlayer()).to.eql(0);
    expect(game.hasSocketId(socket.id)).to.eql(false);

    // check state after player joined
    game.dispatch(ADD_PLAYER(user.playerName, socket));
    expect(game.nbPlayer()).to.eql(1);
    expect(game.hasSocketId(socket.id)).to.eql(true);
  });
})
