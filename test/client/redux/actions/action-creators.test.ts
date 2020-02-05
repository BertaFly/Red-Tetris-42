import { IEventClientSetError, EnumError } from "../../../../src/common/socketEventClient";
import { ON_SET_ERROR, EnumAction, ON_CLEAR_ERROR, SEND_ROOM_PLAYER_NAME, SEND_START_GAME, SEND_JOIN_ROOM, SEND_QUIT_ROOM, SEND_SUB_ROOMS_PLAYERS_NAME, SEND_UN_SUB_ROOMS_PLAYERS_NAME } from "../../../../src/client/redux/actions/action-creators";

it('ON_SET_ERROR', () => {
  const toSend: IEventClientSetError = {
    error_type: EnumError.PLAYING,
    msg: 'You are not allowed to join the game in progress. Please select another room or try later',
  };

  const response = {
    type: EnumAction.ON_SET_ERROR,
    arg: toSend,
  }

  expect(ON_SET_ERROR(toSend)).toStrictEqual(response)
})

it('ON_CLEAR_ERROR', () => {
  const responce = {
    type: EnumAction.ON_CLEAR_ERROR
  }
  expect(ON_CLEAR_ERROR()).toStrictEqual(responce)
})

it('SEND_ROOM_PLAYER_NAME', () => {
  const responce = {
    type: EnumAction.SEND_ROOM_PLAYER_NAME
  }
  expect(SEND_ROOM_PLAYER_NAME()).toStrictEqual(responce)
})

it('SEND_START_GAME', () => {
  const responce = {
    type: EnumAction.SEND_START_GAME
  }
  expect(SEND_START_GAME()).toStrictEqual(responce)
})

it('SEND_JOIN_ROOM', () => {
  const playerName = 'testUser'
  const roomName = 'testRoom'

  const responce = {
    type: EnumAction.SEND_JOIN_ROOM,
    playerName,
    roomName,
  }
  expect(SEND_JOIN_ROOM(playerName, roomName)).toStrictEqual(responce)
})

it('SEND_QUIT_ROOM', () => {
  const responce = {
    type: EnumAction.SEND_QUIT_ROOM
  }
  expect(SEND_QUIT_ROOM()).toStrictEqual(responce)
})

it('SEND_SUB_ROOMS_PLAYERS_NAME', () => {
  const responce = {
    type: EnumAction.SEND_SUB_ROOMS_PLAYERS_NAME
  }
  expect(SEND_SUB_ROOMS_PLAYERS_NAME()).toStrictEqual(responce)
})

it('SEND_UN_SUB_ROOMS_PLAYERS_NAME', () => {
  const responce = {
    type: EnumAction.SEND_UN_SUB_ROOMS_PLAYERS_NAME
  }
  expect(SEND_UN_SUB_ROOMS_PLAYERS_NAME()).toStrictEqual(responce)
})
