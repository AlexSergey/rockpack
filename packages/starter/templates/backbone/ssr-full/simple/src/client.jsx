import React from 'react';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

const [SSR] = createSsr();

const { store } = createStore({
  initState: window.REDUX_DATA,
  history,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </HelmetProvider>
      </Provider>
    </SSR>,
    document.getElementById('root'),
  );
});
