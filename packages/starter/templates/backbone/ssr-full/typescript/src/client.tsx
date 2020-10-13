import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { Provider } from 'react-redux';
import { loadableReady } from '@loadable/component';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import fetch from 'node-fetch';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

const [Ussr] = createUssr();

const insertCss = (...styles) => {
  const removeCss = process.env.NODE_ENV === 'production'
    ? []
    // eslint-disable-next-line no-underscore-dangle
    : styles.map((style) => style && typeof style._insertCss === 'function' && style._insertCss());
  return () => removeCss.forEach((dispose) => dispose());
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
        <StyleContext.Provider value={{ insertCss }}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </StyleContext.Provider>
      </Provider>
    </Ussr>,
    document.getElementById('root'),
  );
});
