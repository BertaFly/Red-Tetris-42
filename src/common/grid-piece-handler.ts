import { IPlayer } from './ITypeRoomManager';

interface IPos {
  readonly x: number,
  readonly y: number
}

interface IPiece {
  readonly num: number,
  readonly rot: number,
}

enum ENUM_PIECES {
  empty = 0,
  n1 = 1,
  n2 = 2,
  n3 = 3,
  n4 = 4,
  n5 = 5,
  n6 = 6,
  n7 = 7,
  wall,
  preview,
}

enum ENUM_PIECES_MOVE {
  ROT_RIGHT = 'ROT_RIGHT',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  DOWN = 'DOWN',
  DROP = 'DROP',
  SWITCH = 'SWITCH',
}

// --- GRID

const GRID_HEIGHT = 24;
const GRID_WIDTH = 10;

enum ENUM_COLLISION_TYPE {
  PIECE = 'collision_piece',
  WALL_RIGHT = 'collision_wall_right',
  WALL_LEFT = 'collision_wall_left',
  WALL_BOTTOM = 'collision_wall_bottom',
}

const PRIO_COLLISION = [
  ENUM_COLLISION_TYPE.PIECE,
  ENUM_COLLISION_TYPE.WALL_BOTTOM,
  ENUM_COLLISION_TYPE.WALL_RIGHT,
  ENUM_COLLISION_TYPE.WALL_LEFT,
];

const gridInit = (gridHeight = GRID_HEIGHT): ENUM_PIECES[][] => {
  return Array(gridHeight).fill(0).map(() =>
    Array(GRID_WIDTH).fill(ENUM_PIECES.empty),
  );
};

const initPose = () => {
  return {
    x: Math.floor(GRID_WIDTH / 2),
    y: 0,
  };
};

const getPiece = (pieces: ENUM_PIECES, rot = 0): ENUM_PIECES[][] => PIECES_DESCR[pieces - 1][rot].piece;

const calcScore = (nbLine: number): number => {
  if (nbLine <= 0) {
    return 0;
  }
  if (nbLine === 1) {
    return 20;
  }
  if (nbLine === 2) {
    return 40;
  }
  if (nbLine === 3) {
    return 80;
  }
  return 160;
};

const movePose = (posPiece: IPos, move: ENUM_PIECES_MOVE): IPos => {
  switch (move) {
    case ENUM_PIECES_MOVE.DOWN:
      return { x: posPiece.x, y: posPiece.y + 1 };
    case ENUM_PIECES_MOVE.LEFT:
      return { x: posPiece.x - 1, y: posPiece.y };
    case ENUM_PIECES_MOVE.RIGHT:
      return { x: posPiece.x + 1, y: posPiece.y };
    default:
      return posPiece;
  }
}

const hasCollision = (grid: ENUM_PIECES[][], pieces: ENUM_PIECES[][], loc: IPos): ENUM_COLLISION_TYPE | undefined => {
  let collisionType: ENUM_COLLISION_TYPE | undefined = undefined;

  const comp = (col1: ENUM_COLLISION_TYPE | undefined, col2: ENUM_COLLISION_TYPE): boolean => {
    if (col1 === undefined) {
      return true;
    }
    return PRIO_COLLISION.indexOf(col1) < PRIO_COLLISION.indexOf(col2);
  }

  pieces.forEach((line, y) => line.forEach((nb, x) => {
    const newX = x + loc.x;
    const newY = y + loc.y;

    if (newY >= grid.length && nb) {
      if (comp(collisionType, ENUM_COLLISION_TYPE.WALL_BOTTOM)) {
        collisionType = ENUM_COLLISION_TYPE.WALL_BOTTOM;
      }
    } else if (newX < 0 && nb) {
      if (comp(collisionType, ENUM_COLLISION_TYPE.WALL_LEFT)) {
        collisionType = ENUM_COLLISION_TYPE.WALL_LEFT;
      }
    } else if (newX >= GRID_WIDTH && nb) {
      if (comp(collisionType, ENUM_COLLISION_TYPE.WALL_RIGHT)) {
        collisionType = ENUM_COLLISION_TYPE.WALL_RIGHT;
      }
    } else if (nb && grid[newY][newX]) {
      if (comp(collisionType, ENUM_COLLISION_TYPE.PIECE)) {
        collisionType = ENUM_COLLISION_TYPE.PIECE;
      }
    }
  }))

  return collisionType;
}

const updatePiecePosOnRot = (grid: ENUM_PIECES[][], posPiece: IPos, piece: IPiece): { piecePlaced: boolean; pos: IPos; piece: IPiece } => {
  const newPiece = {
    ...piece,
    rot: (piece.rot + 1) % 4,
  }

  const newPosPiece: IPos = moveCollision(grid, posPiece, newPiece);

  return { piecePlaced: false, pos: newPosPiece, piece: newPiece }
}

const updatePiecePos = (grid: ENUM_PIECES[][], posPiece: IPos, piece: IPiece, move: ENUM_PIECES_MOVE, ): { piecePlaced: boolean; pos: IPos; piece: IPiece } => {
  const newPieceDescr = getPiece(piece.num, piece.rot);
  const newPos = movePose(posPiece, move);
  const isCol = hasCollision(grid, newPieceDescr, newPos);

  if (move === ENUM_PIECES_MOVE.ROT_RIGHT) {
    return updatePiecePosOnRot(grid, posPiece, piece);
  }

  if (move === ENUM_PIECES_MOVE.RIGHT || move === ENUM_PIECES_MOVE.LEFT) {
    return {
      piecePlaced: false,
      pos: isCol ? posPiece : newPos,
      piece,
    }
  }

  if (move === ENUM_PIECES_MOVE.DROP) {
    let calcPos = posPiece;
    while (!hasCollision(grid, newPieceDescr, calcPos)) {
      calcPos = {
        ...calcPos,
        y: calcPos.y + 1,
      }
    }

    calcPos = {
      ...calcPos,
      y: calcPos.y - 1,
    };

    return { piecePlaced: true, pos: calcPos, piece }
  }

  if (move === ENUM_PIECES_MOVE.DOWN) {
    return isCol ? {
      piecePlaced: true,
      pos: posPiece,
      piece,
    } : {
        piecePlaced: false,
        pos: newPos,
        piece,
      };
  }

  return { piecePlaced: false, pos: posPiece, piece };
}

const placePiece = (grid: ENUM_PIECES[][], piece: IPiece, pos: IPos, isPreview = false): ENUM_PIECES[][] => {
  const pieceDescr = getPiece(piece.num, piece.rot);

  return grid.map((line, y) => line.map((element, x) => {
    if (y >= pos.y && x >= pos.x && y < pos.y + pieceDescr.length && x < pos.x + pieceDescr.length && pieceDescr[y - pos.y][x - pos.x] !== 0) {
      return isPreview ? ENUM_PIECES.preview : pieceDescr[y - pos.y][x - pos.x];
    }
    return element
  }))

}

const moveCollision = (
  grid: ENUM_PIECES[][],
  posPiece: IPos,
  piece: IPiece,
): IPos => {
  const newPieceDescr = getPiece(piece.num, piece.rot);

  let collisionType = hasCollision(grid, newPieceDescr, posPiece);

  let newPos = posPiece;
  while (collisionType) {
    newPos = {
      ...newPos,
      ...(collisionType === ENUM_COLLISION_TYPE.WALL_LEFT ? { x: newPos.x + 1 } :
        collisionType === ENUM_COLLISION_TYPE.WALL_RIGHT ? { x: newPos.x - 1 } :
          { y: newPos.y - 1 }
      ),
    };
    collisionType = hasCollision(grid, newPieceDescr, newPos);
  }
  return newPos;
};

const gridDelLine = (grid: ENUM_PIECES[][]): { grid: ENUM_PIECES[][], nbLineToAdd: number } => {
  let calcLines = 0
  let wallToDell = 0
  let newGrid = grid.map(line => {
    if (line.every(x => x !== ENUM_PIECES.empty && x !== ENUM_PIECES.wall)) {
      calcLines += 1
      wallToDell += 1
      return undefined
    } else if (line.every(x => x === ENUM_PIECES.wall) && wallToDell) {
      wallToDell -= 1
      return undefined
    }
    return line
  }).filter(l => l) as ENUM_PIECES[][];

  while (newGrid.length < grid.length) {
    newGrid = [Array(GRID_WIDTH).fill(ENUM_PIECES.empty), ...newGrid];
  }

  return {
    grid: newGrid,
    nbLineToAdd: calcLines,
  }
}

const gridAddWall = (grid: ENUM_PIECES[][], linesToAdd: number): ENUM_PIECES[][] => {
  const obstacleLine = Array(GRID_WIDTH).fill(ENUM_PIECES.wall)
  const newGrid = [...grid]
  for (let i = 0; i < linesToAdd; i += 1) {
    newGrid.push(obstacleLine)
  }
  return newGrid.slice(linesToAdd)
}

const moveHandler = (players: IPlayer[], move: ENUM_PIECES_MOVE, socketId: string): IPlayer[] => {

  // handle no player
  const player = players.find((p) => p.socket.id === socketId);
  if (player === undefined) {
    return players;
  }

  // switch a tetrimino
  if (move === ENUM_PIECES_MOVE.SWITCH) {
    if (player.flow.length < 2) {
      return players;
    }

    const [frst, scnd, ...rest] = player.flow;
    const newFlow = [scnd, frst, ...rest];

    const { grid, posPiece } = player;

    const newPose = moveCollision(grid, posPiece, newFlow[0]);

    return players.map(pl => {
      if (pl.socket.id === socketId) {
        return {
          ...pl,
          flow: newFlow,
          posPiece: newPose,
        }
      }
      return pl
    })
  }

  // mooved a piece
  const { pos, piece, piecePlaced } = updatePiecePos(player.grid, player.posPiece, player.flow[0], move);

  const newFlow = player.flow.map((pi, i) => (i === 0) ? piece : pi);

  if (!piecePlaced) {
    return players.map(player => player.socket.id === socketId ? {
      ...player,
      posPiece: pos,
      flow: newFlow,
    } : player)
  }

  // actions if piece is placed
  let newPlayer = {
    ...player,
    grid: placePiece(player.grid, newFlow[0], pos),
    flow: newFlow.slice(1),
    posPiece: initPose(),
  };

  const { grid, nbLineToAdd } = gridDelLine(newPlayer.grid);
  const { score, nbLineCompleted } = newPlayer
  const scoreToAdd = calcScore(nbLineToAdd)

  // update score
  newPlayer = {
    ...newPlayer,
    score: nbLineCompleted >= 0 ? score + scoreToAdd : score,
    nbLineCompleted: nbLineCompleted + nbLineToAdd,
    grid,
  };

  // add penalty line, reduce score if needed (order should be remained)
  return players.map(person => {
    if (person.socket.id === socketId) {
      return newPlayer
    }
    return nbLineToAdd ? {
      ...person,
      nbLineCompleted: person.nbLineCompleted - nbLineToAdd,
      grid: gridAddWall(person.grid, nbLineToAdd),
      posPiece: moveCollision(person.grid, person.posPiece, person.flow[0])
    } : person;
  })
}

const placePiecePreview = (grid: ENUM_PIECES[][], piece: IPiece, pos: IPos): ENUM_PIECES[][] => {
  const pieceDescr = getPiece(piece.num, piece.rot);
  let loc = pos;

  // change y pos while not faced with obstacle
  while (!hasCollision(grid, pieceDescr, loc)) {
    loc = { ...loc, y: loc.y + 1 };
  }
  if (loc.y > 0) {
    loc = { ...loc, y: loc.y - 1 };
  }
  return placePiece(grid, piece, loc, true);
};

interface IPieceInfo {
  readonly x: number,
  readonly y: number,
  readonly width: number
}

interface IPiecesDescr {
  readonly info: IPieceInfo,
  readonly piece: ENUM_PIECES[][],
}

const PIECES_DESCR: IPiecesDescr[][] = [
  [
    {
      info: { x: 0, y: -1, width: 4 },
      piece: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      info: { x: -2, y: 0, width: 1 },
      piece: [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    },
    {
      info: { x: 0, y: -2, width: 4 },
      piece: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 1 },
      piece: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    },
  ],
  [
    {
      info: { x: 0, y: 0, width: 3 },
      piece: [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 2 },
      piece: [
        [0, 2, 2],
        [0, 2, 0],
        [0, 2, 0],
      ],
    },
    {
      info: { x: 0, y: -1, width: 3 },
      piece: [
        [0, 0, 0],
        [2, 2, 2],
        [0, 0, 2],
      ],
    },
    {
      info: { x: 0, y: 0, width: 2 },
      piece: [
        [0, 2, 0],
        [0, 2, 0],
        [2, 2, 0],
      ],
    },
  ],
  [
    {
      info: { x: 0, y: 0, width: 3 },
      piece: [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 2 },
      piece: [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ],
    },
    {
      info: { x: 0, y: -1, width: 3 },
      piece: [
        [0, 0, 0],
        [3, 3, 3],
        [3, 0, 0],
      ],
    },
    {
      info: { x: 0, y: 0, width: 2 },
      piece: [
        [3, 3, 0],
        [0, 3, 0],
        [0, 3, 0],
      ],
    },
  ],
  [
    {
      info: { x: -1, y: 0, width: 4 },
      piece: [
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 4 },
      piece: [
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 4 },
      piece: [
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 4 },
      piece: [
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0],
      ],
    },
  ],
  [
    {
      info: { x: 0, y: 0, width: 3 },
      piece: [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 2 },
      piece: [
        [0, 5, 0],
        [0, 5, 5],
        [0, 0, 5],
      ],
    },
    {
      info: { x: 0, y: -1, width: 3 },
      piece: [
        [0, 0, 0],
        [0, 5, 5],
        [5, 5, 0],
      ],
    },
    {
      info: { x: 0, y: 0, width: 2 },
      piece: [
        [5, 0, 0],
        [5, 5, 0],
        [0, 5, 0],
      ],
    },
  ],
  [
    {
      info: { x: 0, y: 0, width: 3 },
      piece: [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 2 },
      piece: [
        [0, 6, 0],
        [0, 6, 6],
        [0, 6, 0],
      ],
    },
    {
      info: { x: 0, y: -1, width: 3 },
      piece: [
        [0, 0, 0],
        [6, 6, 6],
        [0, 6, 0],
      ],
    },
    {
      info: { x: 0, y: 0, width: 2 },
      piece: [
        [0, 6, 0],
        [6, 6, 0],
        [0, 6, 0],
      ],
    },
  ],
  [
    {
      info: { x: 0, y: 0, width: 3 },
      piece: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ],
    },
    {
      info: { x: -1, y: 0, width: 2 },
      piece: [
        [0, 0, 7],
        [0, 7, 7],
        [0, 7, 0],
      ],
    },
    {
      info: { x: 0, y: -1, width: 3 },
      piece: [
        [0, 0, 0],
        [7, 7, 0],
        [0, 7, 7],
      ],
    },
    {
      info: { x: 0, y: 0, width: 2 },
      piece: [
        [0, 7, 0],
        [7, 7, 0],
        [7, 0, 0],
      ],
    },
  ],
];

export {
  IPos,
  IPiece,
  ENUM_PIECES,
  GRID_HEIGHT,
  gridInit,
  initPose,
  ENUM_PIECES_MOVE,
  moveHandler,
  placePiece,
  placePiecePreview,
  getPiece,
  calcScore,
  movePose,
  hasCollision,
  moveCollision,
  PIECES_DESCR,
  ENUM_COLLISION_TYPE,
  updatePiecePosOnRot,
  GRID_WIDTH,
  gridAddWall,
  gridDelLine,
};
