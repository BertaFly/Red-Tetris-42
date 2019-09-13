import { Socket } from 'socket.io';
import { ENUM_SOCKET_EVENT_SERVER } from '../common/types'

const handleClient = (socket: Socket) => {
  console.log('connect', socket.id);

  socket.on(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, (arg: any) => {
    console.log(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);
  });
}

export default handleClient
