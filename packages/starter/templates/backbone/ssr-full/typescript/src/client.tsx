import './types/global';
import React from 'react';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'connected-react-router';
import StyleContext from 'isomorphic-style-loader/StyleContext';
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

const [Ussr] = createUssr();

const insertCss = (...styles): () => void => {
  const removeCss = process.env.NODE_ENV === 'production'
    ? []
    // eslint-disable-next-line no-underscore-dangle
    : styles.map((style) => style && typeof style._insertCss === 'function' && style._insertCss());
  return (): void => removeCss.forEach((dispose) => dispose());
};

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
          <StyleContext.Provider value={{ insertCss }}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </StyleContext.Provider>
        </HelmetProvider>
      </Provider>
    </Ussr>,
    document.getElementById('root'),
  );
});
