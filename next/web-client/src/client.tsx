import { createSsr } from '@issr/core';
import { loadableReady } from '@loadable/component';
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
import logger from 'logrock';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { App } from './app';
import { Router } from './components/router';
import { LocalizationContainer } from './features/localization';
import { createServices } from './services';
import { createStore } from './store';
import './types/global.declaration';
import { createRestClient } from './utils/rest';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    REDUX_DATA: Record<string, unknown>;
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
  hydrateRoot(
    document.getElementById('root'),
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <Router history={history}>
            <LocalizationContainer>
              <App />
            </LocalizationContainer>
          </Router>
        </HelmetProvider>
      </Provider>
    </SSR>,
  );
});
