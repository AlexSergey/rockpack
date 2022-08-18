import './types/global.declaration';
import { createSsr } from '@issr/core';
import { loadableReady } from '@loadable/component';
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
import logger from 'logrock';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './app';
import { Router } from './components/router';
import { LocalizationContainer } from './features/localization';
import { createServices } from './services';
import { createStore } from './store';
import { createRestClient } from './utils/rest';

declare global {
  interface Window {
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const history = createBrowserHistory();

const SSR = createSsr();

const getToken = (): string | undefined => Cookies.get('token');

const rest = createRestClient(getToken);

const store = createStore({
  history,
  initialState: window.REDUX_DATA,
  logger,
  services: createServices(rest),
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <Router history={history}>
          <LocalizationContainer>
            <App />
          </LocalizationContainer>
        </Router>
      </Provider>
    </SSR>,
    document.getElementById('root'),
  );
});
