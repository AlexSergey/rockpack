import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import createUssr from '../../../src';
import createStore from './store';
import rest from './utils/rest';

const [Ussr] = createUssr();

const { store } = createStore({
  rest,
  initState: window.REDUX_DATA
});

hydrate(
  <Ussr>
    <Provider store={store}>
      <App />
    </Provider>
  </Ussr>,
  document.getElementById('root')
);
