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
  } else if (players.length === 1 && !players[0].playing) {
    return players.map(pl => ({
      ...pl,
      win: Boolean(pl.score),
      lost: !Boolean(pl.score),
    }))
  }

  return players;
};

export {
  updateWin,
};
