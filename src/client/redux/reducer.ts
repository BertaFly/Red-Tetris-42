import io from 'socket.io-client';

import { EnumAction } from './actions/actions-creators'

const SOCKET_URL = 'http://localhost:8080';

const socket: SocketIOClient.Socket = io(SOCKET_URL);

const initialState = {
  socket: socket,
  playerName: undefined,
  roomName: undefined,
  roomsPlayersName: [],
}

const reducer = (state = initialState, action: any): any => {
  switch (action.type) {
    case EnumAction.SEND_JOIN_ROOM:
    console.log(`JOIN_ROOM { who: ${action.playerName}, room: ${action.roomName}`)
      return {
        ...state,
        playerName: action.playerName,
        roomName: action.roomName,
      }
    default:
      return state;
  }
}

export {
  reducer
}
