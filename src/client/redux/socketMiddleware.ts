import { ENUM_SOCKET_EVENT_SERVER } from '@src/common/types'
import { EnumAction, ReduxAction } from './actions/actions-creators'

const sendJoinRoom = (socket: SocketIOClient.Socket, args: any) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, args)
}

const socketMiddleware = (store: any) => (next: any) => (action: ReduxAction) => {
  const state = store.getState()

  switch (action.type) {
    case EnumAction.SEND_JOIN_ROOM:
      if (state.socket !== undefined) {
        sendJoinRoom(state.socket, {
          playerName: action.playerName,
          roomName: action.roomName,
        });
      }
      break;
    default:
      break
  }

  return next(action)
}

export { socketMiddleware }
