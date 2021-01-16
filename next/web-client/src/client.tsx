import './types/global';
import React from 'react';
import Cookies from 'js-cookie';
import { hydrate } from 'react-dom';
import logger from 'logrock';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { LocalizationContainer } from './features/Localization';
import { App } from './App';
import { createStore } from './store';
import { createRestClient } from './utils/rest';
import { createServices } from './services';

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

const { store } = createStore({
  logger,
  initState: window.REDUX_DATA,
  history,
  services: createServices(rest)
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LocalizationContainer>
            <App />
          </LocalizationContainer>
        </ConnectedRouter>
      </Provider>
    </SSR>,
    document.getElementById('root')
  );
});
