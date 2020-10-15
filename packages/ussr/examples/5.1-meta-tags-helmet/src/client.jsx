import React from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserHistory } from 'history';
import { App } from './App';
import createUssr from '../../../src';

const [Ussr] = createUssr(window.USSR_DATA);

hydrate(
  <Ussr>
    <HelmetProvider>
      <Router history={createBrowserHistory()}>
        <App />
      </Router>
    </HelmetProvider>
  </Ussr>,
  document.getElementById('root')
);
