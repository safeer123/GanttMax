import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import allReducers from "./reducers";
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

let store = createStore(allReducers, applyMiddleware(thunk, promise()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);