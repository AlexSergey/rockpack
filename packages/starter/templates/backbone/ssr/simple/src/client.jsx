import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import { createBrowserHistory } from 'history';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { App } from './app';
import { Router } from './components/router';
import { createServices } from './services';
import { createStore } from './store';

const history = createBrowserHistory();

const SSR = createSsr();

const store = createStore({
  history,
  initialState: window.REDUX_DATA,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <Router history={history}>
            <App />
          </Router>
        </HelmetProvider>
      </Provider>
    </SSR>,
    document.getElementById('root'),
  );
});
