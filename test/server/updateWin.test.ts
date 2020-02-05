import { updateWin } from '../../src/server/updateWin';
import { GRID_HEIGHT, gridInit, initPose } from '../../src/common/grid-piece-handler';

const playerTest = {
  playerName: 'test',
  socket: ((arg: any) => { }) as any,
  isSpectator: true,
  grid: gridInit(GRID_HEIGHT),
  score: 0,
  nbLineCompleted: 0,
  playing: true,
  win: false,
  lost: false,
  gameOver: false,
  isMaster: true,
  flow: [],
  posPiece: initPose(),
}

it('Not modify single player if he is playing', () => {
  expect(updateWin([playerTest])).toStrictEqual([playerTest]);
})

it('One player win', () => {
  const playerFinished = {
    ...playerTest,
    isSpectator: false,
    playing: false,
  }
  const playerFinishedWin = {
    ...playerTest,
    isSpectator: false,
    playing: false,
    score: 20,
  }
  expect(updateWin([playerFinished])[0].win).toBe(false);
  expect(updateWin([playerFinishedWin])[0].win).toBe(true);
})

it('Who win', () => {
  const winner = 'winnerName';
  const playerFinished1 = {
    ...playerTest,
    isSpectator: false,
    score: 20,
    playing: true,
  }
  const playerFinished2 = {
    ...playerTest,
    playerName: winner,
    score: 60,
    playing: false,
    isSpectator: false,
  }
  expect(updateWin([playerFinished1, playerFinished2])[1].win).toBe(true);
})
