import './types/global';
import React from 'react';
import Cookies from 'js-cookie';
import { hydrate } from 'react-dom';
import logger from 'logrock';
import createSsr from '@issr/core';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { Provider } from 'react-redux';
import { LocalizationContainer } from './features/Localization';
import { App } from './App';
import { createStore } from './store';
import { createRestClient } from './utils/rest';
import { createServices } from './services';
import { Router } from './components/Router';

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
  logger,
  history,
  initialState: window.REDUX_DATA,
  services: createServices(rest)
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
    document.getElementById('root')
  );
});
