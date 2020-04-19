import React from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { createBrowserHistory } from 'history';
import { App } from './App';
import createUssr from '../../../src';

const [, Ussr] = createUssr(window.USSR_DATA);

loadableReady(() => (
  hydrate(
    <Ussr>
      <Router history={createBrowserHistory()}>
        <App />
      </Router>
    </Ussr>,
    document.getElementById('root')
  )
));
