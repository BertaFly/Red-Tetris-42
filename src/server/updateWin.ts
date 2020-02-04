import { IPlayer } from '@src/common/ITypeRoomManager';

const updateWin = (players: IPlayer[]): IPlayer[] => {

  if (players.filter((p) => !p.isSpectator).length > 1) {
    if (players.filter((p) => p.playing).length === 1) {
      const playerMaxScore = players.reduce((prev, current) => (prev.score > current.score) ? prev : current)
      return players.map(p =>
        ({
          ...p,
          playing: false,
          win: p.playerName === playerMaxScore.playerName,
          lost: p.playerName !== playerMaxScore.playerName,
          gameOver: true,
        })
      );
    }
  }

  return players;
};

export {
  updateWin,
};
