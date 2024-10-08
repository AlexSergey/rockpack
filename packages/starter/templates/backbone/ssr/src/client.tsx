import { createSsr } from '@issr/core';
import { loadableReady } from '@loadable/component';
import { createBrowserHistory } from 'history';
import fetch from 'node-fetch';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { App } from './app';
import { Router } from './components/router';
import { createServices } from './services';
import { createStore } from './store';
import './types/global.declaration';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    REDUX_DATA: Record<string, unknown>;
  }
}

const history = createBrowserHistory();

const SSR = createSsr();

const store = createStore({
  history,
  initialState: window.REDUX_DATA,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrateRoot(
    document.getElementById('root') as Element,
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <Router history={history}>
            <App />
          </Router>
        </HelmetProvider>
      </Provider>
    </SSR>,
  );
});
