import { reducer, initApp } from '../../../src/client/redux/reducer';
import {
  ON_SET_ERROR,
  ON_SET_ROOM_STATE,
  ON_SET_ROOMS_PLAYERS_NAME,
  REFRESH,
  ON_CLEAR_ERROR,
  SEND_QUIT_ROOM,
  SEND_JOIN_ROOM,
} from '../../../src/client/redux/actions/action-creators';
import { EnumError } from '../../../src/common/socketEventClient';

const state = reducer(initApp(), {} as any);

it('ON_SET_ERROR', () => {
  const newState = reducer(state, ON_SET_ERROR({
    error_type: EnumError.PLAYER_SAME_NAME,
    msg: 'msg',
  }))
  if (newState) {
    expect(newState.errorMsg).toBe('msg');
  }
});

it('ON_SET_ROOM_STATE', () => {
  const newState = reducer(state, ON_SET_ROOM_STATE({
    room: {
      roomName: 'roomname',
      playing: true,
      players: [],
    },
  }))
  if (newState && newState.roomState) {
    expect(newState.roomState.roomName).toBe('roomname');
  }
});

it('ON_SET_ROOMS_PLAYERS_NAME', () => {
  const newState = reducer(state, ON_SET_ROOMS_PLAYERS_NAME({
    roomsPlayersName: [],
  }))
  if (newState) {
    expect(newState.roomsPlayersName.length).toBe(0);
  }
});

it('REFRESH', () => {
  reducer(state, REFRESH());
});

it('ON_CLEAR_ERROR', () => {
  expect(reducer(state, ON_CLEAR_ERROR()).errorMsg).toBe(undefined)
})

it('SEND_QUIT_ROOM', () => {
  expect(reducer(state, SEND_QUIT_ROOM()).playerName).toBe(undefined)
})

it('SEND_JOIN_ROOM', () => {
  expect(reducer(state, SEND_JOIN_ROOM('test', 'test')).playerName).toBe('test')
})

state.socket.disconnect();
