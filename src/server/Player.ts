import { Socket } from 'socket.io';

import { gridInit, initPose } from '@src/common/grid-piece-handler';
import { IPlayer } from '@src/common/ITypeRoomManager';

class Player {
  static newPlayer = (playerName: string, socket: Socket, isMaster: boolean, gridHeight: number): IPlayer => {

    return {
      playerName: playerName,
      socket: socket,
      isSpectator: true,
      grid: gridInit(gridHeight),
      score: 0,
      nbLineCompleted: 0,
      playing: false,
      win: false,
      lost: false,
      gameOver: false,
      isMaster: isMaster,
      flow: [],
      posPiece: initPose(),
    };
  };
}

export { Player }
