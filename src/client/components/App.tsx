import React, { useCallback, useState } from "react";
import {useDispatch} from 'redux-react-hook';

import { SEND_JOIN_ROOM } from '../redux/actions/actions-creators'

const App = () => {
  const [roomNameInput, setRoomNameInput] = useState('');
  const [playerNameInput, setPlayerNameInput] = useState('');

   // Declare your memoized mapState function
  //  const mapState = useCallback(
  //   state => ({
  //     roomName: state.store.roomName,
  //     playerName: state.store.playerName,
  //   }),
  //   [],
  // );

  // Get data from and subscribe to the store
  // const {roomName, playerName} = useMappedState(mapState);

  // Create actions
  const dispatch = useDispatch();
  const joinPlayerToRoom = useCallback(
    () =>
      dispatch(
        SEND_JOIN_ROOM(roomNameInput, playerNameInput)
      ),
    [roomNameInput, playerNameInput],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('onChange')
    if (event.target.name === 'roomName') {
      setRoomNameInput(event.target.value)
    } else {
      setPlayerNameInput(event.target.value)
    }
  }

  return (
    <>
      <input onChange={handleChange} name="roomName" />
      <input onChange={handleChange} name="playerName" />
      <button onClick={joinPlayerToRoom}>Join</button>
    </>
  )
};

export default App;
