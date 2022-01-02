import './types/global';
import React from 'react';
import Cookies from 'js-cookie';
import { hydrate } from 'react-dom';
import logger from 'logrock';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import { BrowserRouter } from 'react-router-dom';
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

const SSR = createSsr();

const getToken = (): string | undefined => Cookies.get('token');

const rest = createRestClient(getToken);

const store = createStore({
  logger,
  initialState: window.REDUX_DATA,
  services: createServices(rest)
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationContainer>
            <App />
          </LocalizationContainer>
        </BrowserRouter>
      </Provider>
    </SSR>,
    document.getElementById('root')
  );
});
