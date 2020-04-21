import React, { createElement } from 'react';
import { hydrate } from 'react-dom';
import { App } from './App';
import createUssr from '../../../src';
import createStore from './store';

const [, Ussr] = createUssr({});


const store = createStore({
  initState: window.REDUX_DATA
});

hydrate(
  <Ussr>
    {createElement(App({
      store
    }))}
  </Ussr>,
  document.getElementById('root')
);
