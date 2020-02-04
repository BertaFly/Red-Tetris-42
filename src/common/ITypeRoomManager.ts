import { Socket } from 'socket.io';

import { ENUM_PIECES, IPiece, IPos } from '@src/common/grid-piece-handler';

interface IPlayer {
  readonly playerName: string;
  readonly socket: Socket;
  readonly isSpectator: boolean;
  readonly grid: ENUM_PIECES[][];
  readonly score: number;
  readonly nbLineCompleted: number;
  readonly playing: boolean;
  readonly win: boolean;
  readonly lost: boolean;
  readonly gameOver: boolean;
  readonly flow: IPiece[];
  readonly posPiece: IPos;
  readonly isMaster: boolean;
}

interface IRoomState {
  readonly roomName: string;
  readonly playing: boolean;
  readonly players: IPlayer[];
}

export {
  IPlayer,
  IRoomState,
};
