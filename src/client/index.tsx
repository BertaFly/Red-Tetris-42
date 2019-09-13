import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StoreContext } from 'redux-react-hook';

import { reducer } from '@src/client/redux/reducer';
import { socketMiddleware } from '@src/client/redux/socketMiddleware';

import App from "./components/App";

import "./css/main.scss";

const store = createStore(reducer, applyMiddleware(socketMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </Provider>, document.getElementById("root"));
