import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { IDataState } from '@src/client/redux/reducer';

import routes from '@src/client/config/routes';

import { Home } from './home';
import { Game } from './game';
import OffLine from './Offline';

const App = () => {

  const mapState = useCallback(
    (state: IDataState) => ({
      connected: state.socket.connected,
      playerName: state.playerName,
      roomName: state.roomState,
    }),
    [],
  );
  const { connected } = useMappedState(mapState);

  if (!connected) {
    return <OffLine />;
  }

  return (
    <HashRouter hashType="noslash" basename="/Red-Tetris-42">
      <Switch>
        <Route exact path={routes.index} component={Home} />
        <Route exact path={routes.game} component={Game} />
      </Switch>
    </HashRouter>
  );
};

export { App };
