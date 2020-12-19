import React from 'react';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

const [Ussr] = createUssr();

const { store } = createStore({
  initState: window.REDUX_DATA,
  history,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrate(
    <Ussr>
      <Provider store={store}>
        <HelmetProvider>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </HelmetProvider>
      </Provider>
    </Ussr>,
    document.getElementById('root'),
  );
});
