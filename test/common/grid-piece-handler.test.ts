import {
  ENUM_PIECES,
  getPiece,
  PIECES_DESCR,
  calcScore,
  ENUM_PIECES_MOVE,
  movePose,
  IPos,
  hasCollision,
  gridInit,
  ENUM_COLLISION_TYPE,
  updatePiecePosOnRot,
  GRID_WIDTH,
  gridAddWall,
  placePiecePreview,
  placePiece,
  moveCollision,
  gridDelLine
} from '../../src/common/grid-piece-handler';

it('getPiece', () => {
  expect(getPiece(ENUM_PIECES.n1, 1)).toStrictEqual(PIECES_DESCR[0][1].piece)

  expect(getPiece(ENUM_PIECES.n2)).toStrictEqual(PIECES_DESCR[1][0].piece)
})

it('calcScore', () => {
  expect(calcScore(-1)).toBe(0)
  expect(calcScore(1)).toBe(20)
  expect(calcScore(2)).toBe(40)
  expect(calcScore(3)).toBe(80)
  expect(calcScore(10)).toBe(160)
})

it('movePose', () => {
  const posPiece: IPos = {
    x: 5,
    y: 1,
  }

  expect(movePose(posPiece, ENUM_PIECES_MOVE.DOWN)).toStrictEqual({ x: posPiece.x, y: posPiece.y + 1 })
  expect(movePose(posPiece, ENUM_PIECES_MOVE.LEFT)).toStrictEqual({ x: posPiece.x - 1, y: posPiece.y })
  expect(movePose(posPiece, ENUM_PIECES_MOVE.RIGHT)).toStrictEqual({ x: posPiece.x + 1, y: posPiece.y })
  expect(movePose(posPiece, ENUM_PIECES_MOVE.DROP)).toStrictEqual(posPiece)
})

it('hasCollision', () => {
  const grid = gridInit()
  // long horizontal line
  const piece = {
    num: ENUM_PIECES.n1,
    rot: 0,
  }
  // end right
  const rightWall = { x: 9, y: 4 }

  const newPieceDescr = getPiece(piece.num, piece.rot);
  const newPosR = movePose(rightWall, ENUM_PIECES_MOVE.RIGHT);
  expect(hasCollision(grid, newPieceDescr, newPosR)).toBe(ENUM_COLLISION_TYPE.WALL_RIGHT);

  // end left
  const leftWall = { x: 0, y: 4 }
  const newPosL = movePose(leftWall, ENUM_PIECES_MOVE.LEFT);
  expect(hasCollision(grid, newPieceDescr, newPosL)).toBe(ENUM_COLLISION_TYPE.WALL_LEFT);

  //bottom
  const bottomWall = { x: 5, y: 23 }
  const newPosBottom = movePose(bottomWall, ENUM_PIECES_MOVE.DOWN);
  expect(hasCollision(grid, newPieceDescr, newPosBottom)).toBe(ENUM_COLLISION_TYPE.WALL_BOTTOM);

  // piece
  const bottomPiece = { x: 3, y: 22 }
  const occupiedGrid = [...grid]
  occupiedGrid.splice(22, 2, [0, 0, 0, 0, 4, 4, 0, 0, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0, 0, 0])
  const newPosBottomPiece = movePose(bottomPiece, ENUM_PIECES_MOVE.RIGHT);
  expect(hasCollision(occupiedGrid, newPieceDescr, newPosBottomPiece)).toBe(ENUM_COLLISION_TYPE.PIECE);

  // allright
  const posPis = { x: 2, y: 5 }
  const newPos = movePose(posPis, ENUM_PIECES_MOVE.DOWN);
  expect(hasCollision(grid, newPieceDescr, newPos)).toBe(undefined);
})

it('updatePiecePosOnRot', () => {
  // vertical line
  expect(updatePiecePosOnRot(gridInit(), { x: 1, y: 8 }, { num: ENUM_PIECES.n1, rot: 1 }).piecePlaced).toBe(false)
})

it('gridAddWall', () => {
  const grid = gridInit()
  const gridWithPenalty = gridInit()
  gridWithPenalty.splice(23, 1, Array(GRID_WIDTH).fill(ENUM_PIECES.wall))

  expect(gridAddWall(grid, 1)).toStrictEqual(gridWithPenalty)
})

it('placePiecePreview', () => {
  const gridWithPreview = gridInit()
  gridWithPreview.splice(23, 1, [ENUM_PIECES.preview, ENUM_PIECES.preview, ENUM_PIECES.preview, ENUM_PIECES.preview, 0, 0, 0, 0, 0, 0])
  expect(placePiecePreview(gridInit(), { num: 1, rot: 2 }, { x: 0, y: 4 })).toStrictEqual(gridWithPreview)
})

it('moveCollision', () => {
  const grid = gridInit()
  expect(moveCollision(grid, { x: -1, y: 4 }, { num: 1, rot: 0 }).x).toBe(0)
  expect(moveCollision(grid, { x: 7, y: 4 }, { num: 1, rot: 0 }).x).toBe(6)
  expect(moveCollision(grid, { x: 5, y: 24 }, { num: 1, rot: 0 }).y).toBe(22)
})

it('placePiece', () => {
  const gridWithPreview = gridInit()
  gridWithPreview.splice(23, 1, [ENUM_PIECES.preview, ENUM_PIECES.preview, ENUM_PIECES.preview, ENUM_PIECES.preview, 0, 0, 0, 0, 0, 0])
  expect(placePiece(gridInit(), { num: 1, rot: 2 }, { x: 0, y: 21 }, true)).toStrictEqual(gridWithPreview)

  const gridWithPiece = gridInit()
  gridWithPiece.splice(23, 1, [ENUM_PIECES.n1, ENUM_PIECES.n1, ENUM_PIECES.n1, ENUM_PIECES.n1, 0, 0, 0, 0, 0, 0])
  expect(placePiece(gridInit(), { num: 1, rot: 2 }, { x: 0, y: 21 })).toStrictEqual(gridWithPiece)
})

it('gridDelLine', () => {
  const gridWithLine = gridInit()
  gridWithLine.splice(23, 1, Array(GRID_WIDTH).fill(ENUM_PIECES.n1))

  expect(gridDelLine(gridWithLine)).toStrictEqual({ grid: gridInit(), nbLineToAdd: 1 })

  const gridLineWall = gridInit()
  gridLineWall.splice(21, 3, Array(GRID_WIDTH).fill(ENUM_PIECES.n1), Array(GRID_WIDTH).fill(ENUM_PIECES.n1), Array(GRID_WIDTH).fill(ENUM_PIECES.wall))
  expect(gridDelLine(gridLineWall)).toStrictEqual({ grid: gridInit(), nbLineToAdd: 2 })
})

// updatePiecePos

// moveHandler
