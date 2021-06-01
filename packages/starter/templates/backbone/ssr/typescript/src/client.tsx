import './types/global';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import App from './App';
import createStore from './store';
import createServices from './services';

declare global {
  interface Window {
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const history = createBrowserHistory();

const SSR = createSsr();

const store = createStore({
  initialState: window.REDUX_DATA,
  history,
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
