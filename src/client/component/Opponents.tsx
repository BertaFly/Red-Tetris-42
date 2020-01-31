import * as React from 'react';

import { IPlayerClient } from '@src/common/socketEventClient';
import { ENUM_PIECES } from '@src/common/grid-piece-handler';

type Props = {
  players: IPlayerClient[]
}

export const Opponents: React.FC<Props> = ({ players }) => {
  const modifiedPlayers = players.map(pl => {
    const hideElArrX: number[] = []

    return {
      ...pl,
      grid: pl.grid.slice(4).map((line, y) => {
        return line.map((el, x) => {
          if (el) {
            hideElArrX.push(x)
          }
          if (hideElArrX.includes(x)) {
            el = ENUM_PIECES.wall
          }
          return el
        })
      })
    }
  })

  return (
    <div className="opponents">
      <h2>Opponents</h2>
      <div className="game-page">
        {modifiedPlayers.map(competitor => (
          <div className="game-grid" key={competitor.playerName}>
            {competitor.grid.map((line: number[], i: number) =>
              <div key={i} className="row">
                {line.map((el: number, j: number) => <div key={j} className={`casePlayer color-${el}`} />)}
              </div>,
            )}
            <p>Name: <b>{competitor.playerName}</b></p>
            {!competitor.playing && (competitor.win || competitor.lost) ? (
              <p>{competitor.win ? 'Win' : 'Lose'}</p>
            ) : null}
            <p>Score: {competitor.score}</p>
            <p>Lines: {competitor.nbLineCompleted}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
