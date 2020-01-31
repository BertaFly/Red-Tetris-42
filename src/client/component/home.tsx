import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHistory, generatePath } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import routes from '@src/client/config/routes';
import { IRoomPlayersName } from '@src/common/socketEventClient';

import { IDataState } from '../redux/reducer';
import { SEND_SUB_ROOMS_PLAYERS_NAME, SEND_UN_SUB_ROOMS_PLAYERS_NAME, SEND_JOIN_ROOM } from '../redux/actions/action-creators';

type Error = {
  field: string
  msg: string
}

export const Home = () => {
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);

  const dispatch = useDispatch();

  const mapState = useCallback(
    (state: IDataState) => ({
      roomsPlayersName: state.roomsPlayersName,
    }),
    [],
  );
  const { roomsPlayersName } = useMappedState(mapState);

  const history = useHistory()

  useEffect(() => {
    dispatch(SEND_SUB_ROOMS_PLAYERS_NAME());
    return () => {
      dispatch(SEND_UN_SUB_ROOMS_PLAYERS_NAME());
    }
  }, [])

  const getRoom = (): IRoomPlayersName | undefined => roomsPlayersName.find(room => room.roomName === roomName)

  const checkOcupiedNames = (): boolean => {
    if (roomName && playerName) {
      if (roomsPlayersName.length) {
        const roomToCheck = getRoom()
        if (roomToCheck && roomToCheck.playerNames.includes(playerName)) {
          return true
        } else {
          return false
        }
      }
    }
    return false
  }

  const validateInput = (field: string, value: string) => {
    if (value === '') {
      setErrors((prevErrors) => [...(errors.every(err => err.field !== field) ? prevErrors : prevErrors.filter(e => e.field !== field)), { field: field, msg: 'This field is required' }])
    } else if (value.length < 3) {
      setErrors((prevErrors) => [...(errors.every(err => err.field !== field) ? prevErrors : prevErrors.filter(e => e.field !== field)), { field: field, msg: `${field} length should have at least 3 letters` }])
    } else {
      setErrors((prevErrors) => checkOcupiedNames() ? [...prevErrors, { field: field, msg: `Entered player name has already taken in the '${roomName}'. Change room or player` }] : prevErrors.filter(error => error.field !== field))
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'Room name') {
      setRoomName(event.target.value)
    } else {
      setPlayerName(event.target.value)
    }
    event.persist()
    validateInput(event.target.name, event.target.value)
  }

  const getRoomError = (): string => {
    if (errors.length) {
      const err = errors.find(error => error.field === 'Room name')
      return err ? err.msg : ''
    }
    return ''
  }

  const getPlayerError = (): string => {
    if (errors.length) {
      const err = errors.find(error => error.field === 'Player name')
      return err ? err.msg : ''
    }
    return ''
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(SEND_JOIN_ROOM(playerName, roomName));
    history.push(generatePath(`${routes.game}[${playerName}]`, { roomName }))
  }

  const selectedRoom = getRoom()

  return (
    <div className="splash-container">
      <div className="splash">
        <form className="pure-form pure-form-stacked login-form" onSubmit={onSubmit}>
          <h1 className="text-center">
            Tetris
          </h1>
          <div className="pure-control-group">
            <label htmlFor="roomName">Room name *</label>
            <input id="roomName" type="text" placeholder="Room name" value={roomName} name="Room name" onChange={onChange} onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              validateInput('Room name', e.target.value)
            }} title="This is a required field. At least 3 letters" />
            {getRoomError() && (<span className="pure-form-message error-text">{getRoomError()}</span>)}
          </div>
          <div className="pure-control-group">
            <label htmlFor="playerName">Player name *</label>
            <input id="playerName" type="text" placeholder="Player name" name="Player name" value={playerName} onChange={onChange} onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              validateInput('Player name', e.target.value)
            }} title="This is a required field. At least 3 letters" />
            {getPlayerError() && (<span className="pure-form-message error-text">{getPlayerError()}</span>)}
          </div>
          <div className="pure-controls">
            <button type="submit" className="pure-button pure-button-primary button-success" disabled={Boolean(errors.length)}>Join</button>
          </div>
          {roomsPlayersName.length ? (
            <div className="pure-control-group room-options-container" style={{ marginTop: '1rem' }}>
              <span style={{ marginBottom: '5px' }}>
                or you can select a room from list
              </span>
              {roomsPlayersName.map(room => <button className={`room-option${roomName === room.roomName ? ' selected-room-option' : ''}`} key={room.roomName} type="button" onClick={() => {
                setRoomName(room.roomName)
                setErrors((prevErrors) => [...prevErrors.filter(e => e.field !== 'Room name')])
              }}>{room.roomName}</button>)}

              {selectedRoom ? (
                <>
                  <span style={{ margin: '5px 0' }}>Currently in room:</span>
                  <ul className="players-in-room">
                    {selectedRoom.playerNames.map(player => <li key={player} >{player}</li>)}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}
        </form>
      </div>
    </div>

  )
};
