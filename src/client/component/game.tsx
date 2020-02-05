import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { useHistory, useParams, Link } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { SEND_QUIT_ROOM, SEND_START_GAME, SEND_MOVE_PIECE, SEND_JOIN_ROOM } from '@src/client/redux/actions/action-creators';
import routes from '../config/routes';
import { IDataState } from '../redux/reducer';
import { placePiece, ENUM_PIECES_MOVE, ENUM_PIECES, placePiecePreview } from '@src/common/grid-piece-handler';

import { Modal } from './Modal'
import { Opponents } from './Opponents';
import { FireWorks } from './Fireworks';
import { IPlayerClient } from '@src/common/socketEventClient';

const mp3 = require('@src/client/assets/Original_Tetris_theme.mp3');

const keySpace = 32;
const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;
const keyS = 83;

const initPreviewGrid = (): ENUM_PIECES[][] => {
  const lineBuild = [...(Array(4).fill(ENUM_PIECES.empty))];

  const tetriminoField = [
    lineBuild,
    lineBuild,
    lineBuild,
    lineBuild,
  ];

  return [
    ...tetriminoField,
    ...tetriminoField,
    ...tetriminoField,
  ];
};

export const Game = () => {
  const [endGameModal, showEndGameModal] = useState(false)
  const history = useHistory();
  const { roomName } = useParams();

  const mapState = useCallback(
    (state: IDataState) => {
      const { roomState, errorMsg } = state;
      if (roomState === undefined) {
        return {
          playing: false,
          isMaster: false,
          player: undefined,
          opponents: [] as IPlayerClient[],
          errorMsg,
        };
      }

      const player = roomState.players.find((p) => p.playerName === state.playerName);

      return {
        playing: roomState.playing,
        isMaster: player ? player.isMaster : false,
        player,
        grid: player ? player.grid : undefined,
        opponents: roomState.players.filter((p) => p.playerName !== state.playerName),
        errorMsg,
      };
    },
    [],
  );

  const dispatch = useDispatch();

  const onUserKeyPress = useCallback(event => {
    const { keyCode } = event;

    event.preventDefault();

    switch (keyCode) {
      case keyLeft:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.LEFT));
        break;

      case keyUp:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.ROT_RIGHT));
        break;

      case keyRight:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.RIGHT));
        break;

      case keyDown:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.DOWN));
        break;

      case keySpace:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.DROP));
        break;

      case keyS:
        dispatch(SEND_MOVE_PIECE(ENUM_PIECES_MOVE.SWITCH));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onUserKeyPress);

    return () => {
      window.removeEventListener('keydown', onUserKeyPress);
    };
  }, [onUserKeyPress]);

  const { isMaster, playing, player, grid, opponents, errorMsg } = useMappedState(mapState);

  useEffect(() => {
    if (player) {
      const { win, lost } = player
      if (!playing && (win || lost)) {
        showEndGameModal(true);
      }
    }
  }, [playing, player])

  useEffect(() => {
    if (roomName) {
      const curRoom = roomName.split('[')[0]
      const curPlayer = roomName.split('[')[1].substr(0, roomName.split('[')[1].length - 1)
      if (!player && curRoom && curPlayer) {
        dispatch(SEND_JOIN_ROOM(curPlayer, curRoom));
        return
      }
    }
  }, [roomName, player]);

  if (errorMsg) {
    return (
      <div className="splash-container">
        <div className="splash">
          <div className="game-page" style={{
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h1 style={{ textAlign: 'center' }}>{errorMsg}</h1>
            <Link to={routes.index} className="home-btn">Home</Link>
          </div>
        </div>
      </div>
    )
  }

  if (player === undefined) {
    return (
      <div className="splash-container">
        <div className="splash">
          <div className="game-page">
            Waiting server ...
          </div>
        </div>
      </div>
    );
  }

  const renderGrid = (): React.ReactNode[] | null => {
    if (grid) {
      const { flow, posPiece } = player
      const gridWithPiece = playing ? placePiece(placePiecePreview(grid, flow[0], posPiece), flow[0], posPiece) : grid
      const fieldToRender = gridWithPiece.slice(4)
      return fieldToRender.map((line: number[], i: number) =>
        <div key={i} className="row">
          {line.map((el: number, j: number) => <div key={j} className={`casePlayer color-${el}`} />)}
        </div>,
      )
    }
    return null
  }

  //FLOW
  let previewGrid = initPreviewGrid()
  const piecesRender = player.flow.slice(1, 4);

  if (player.flow.length && !player.lost && !player.win && !player.isSpectator) {
    for (let i = 0; i < piecesRender.length; i += 1) {
      const piece = piecesRender[i];
      previewGrid = placePiece(previewGrid, piece, { x: 0, y: i * 4 });
    }
  }

  return (
    <div className="splash-container">
      <h1 className="text-center text-white">TETRIS</h1>
      <div className="game-page">
        <div className="left-column">
          <div className="welcome">
            <span>Welcome <b>{player ? player.playerName : ''}</b>!</span>
          </div>

          <div className="user-description">
            <span>
              You are {isMaster ? 'an Owner of' : 'a Guest in'} this room
            </span>
          </div>

          <div className="game-controlls">
            <button onClick={() => {
              dispatch(SEND_QUIT_ROOM())
              history.push(routes.index)
            }} className="exit">Exit</button>
            {!playing && isMaster ? (<button onClick={() => {
              dispatch(SEND_START_GAME())
            }} className="play">Play</button>) : null}
          </div>

          <h3 style={{ textAlign: 'center' }}>Instructions</h3>
          <div className="legend">
            <span className="">Move right: ➡️</span>
            <span className="">Move left: ⬅️</span>
            <span className="">Move down: ⬇️</span>
            <span className="">Rotate: ⬆️</span>
            <span className="">Place a piece: space</span>
            <span className="">Switch a piece: S️</span>
            <span className="instructions">Once your opponent complete a line you will get -line and a penalty line at bottom, but you can reduce it by complete a line on your side</span>
            <span>1 line - 20</span>
            <span>2 line - 40</span>
            <span>3 line - 80</span>
            <span>4 line - 160</span>
          </div>

          <span style={{ marginTop: '0.5rem', display: 'block' }}>
            Lines completed: {player ? player.nbLineCompleted : ''}
          </span>
        </div>
        <div className="right-column">

          <div className="game-grid">
            <span className="my-score">Score: {player ? player.score : ''}</span>
            {renderGrid()}
          </div>

          {playing ? (<div className="preview-grid">
            {previewGrid.map((line: number[], i: number) =>
              <div key={`${line}-${i}`} className="row">
                {line.map((el: number, j: number) => <div key={`preview-${j}`} className={`casePlayer color-${el}`} />)}
              </div>
            )}
          </div>) : null}

        </div>
      </div>

      {opponents && opponents.length ? (
        <Opponents players={opponents} />
      ) : null}

      <audio controls={true} loop={true} autoPlay={true} src={mp3} className="audio" />

      <Modal show={player.gameOver && !player.win && !player.lost} onClose={() => {
        dispatch(SEND_QUIT_ROOM())
        history.push(routes.index)
      }
      }>
        <>
          <h2>Game over</h2>
          <p>Please waite untill all players finish to know who is the winner.</p>
          <p>Your exit will automatically cause a defeat and you will be redirected to the home screen.</p>
        </>
      </Modal>

      <Modal show={endGameModal} onClose={() => showEndGameModal(false)} isWin={player.win ? 'win' : 'lost'}>
        {player.win ? (<>
          <h2>Congratulations</h2>
          <p>You win</p>
          <p>Score: {player.score}</p>
          <p>Lines completed: {player.nbLineCompleted}</p>
        </>) : (<>
          <h2>Unfortunately</h2>
          <p>You lost</p>
          <p>Score: {player.score}</p>
          <p>Lines completed: {player.nbLineCompleted}</p>
        </>)}
      </Modal>

      {endGameModal && player.win ? <FireWorks /> : null}

    </div>
  )
};
