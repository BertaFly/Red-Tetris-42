enum EnumAction {
  SEND_JOIN_ROOM,
}

// SEND_JOIN_ROOM
type SendJoinRoom = {
  type: EnumAction.SEND_JOIN_ROOM,
  playerName: string,
  roomName: string,
}

const SEND_JOIN_ROOM = (playerName: string, roomName: string): SendJoinRoom => {
  return {
    type: EnumAction.SEND_JOIN_ROOM,
    playerName,
    roomName,
  };
};

type ReduxAction = SendJoinRoom

export {
  EnumAction,
  ReduxAction,
  SEND_JOIN_ROOM,
};
