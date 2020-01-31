import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { SEND_QUIT_ROOM, SEND_START_GAME, SEND_MOVE_PIECE, SEND_JOIN_ROOM, ON_CLEAR_ERROR } from '@src/client/redux/actions/action-creators';
import routes from '../config/routes';
import { IDataState } from '../redux/reducer';
import { placePiece, ENUM_PIECES_MOVE, ENUM_PIECES } from '@src/common/grid-piece-handler';

import { Modal } from './Modal'
import { Opponents } from './Opponents';
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
      }
    }
  }, [roomName, player]);

  useEffect(() => {
    if (!errorMsg) {
      dispatch(ON_CLEAR_ERROR())
    }
  }, [errorMsg])

  if (errorMsg) {
    return (
      <div className="splash-container">
        <div className="game-page">
          <h1>{errorMsg}</h1>
        </div>
      </div>
    )
  }

  if (player === undefined) {
    return (
      <div className="column">
        Waiting server ...
      </div>
    );
  }

  const renderGrid = (): React.ReactNode[] | null => {
    if (grid) {
      const gridWithPiece = playing ? placePiece(grid, player.flow[0], player.posPiece) : grid
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
          <div className="legend">
            <span className="">Move right: ➡️</span>
            <span className="">Move left: ⬅️</span>
            <span className="">Move down: ⬇️</span>
            <span className="">Rotate: ⬆️</span>
            <span className="">Place the piece: space</span>
            <span className="">Switch the current piece with the next piece: S️</span>
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

          <div className="user-description">
            <span>
              Name: <b>{player ? player.playerName : ''}</b>
            </span>
            <span>
              {isMaster ? 'Owner' : 'Guest'}
            </span>
            <span>
              Score: {player ? player.score : ''}
            </span>
            <span>
              Lines completed: {player ? player.nbLineCompleted : ''}
            </span>
          </div>
        </div>
        <div className="right-column">

          <div className="game-grid">
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

      <audio controls={true} loop={true} autoPlay={false} src={mp3} className="audio" />

      <Modal show={endGameModal} onClose={() => showEndGameModal(false)} isWin={player.win}>
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
    </div>
  )
};
