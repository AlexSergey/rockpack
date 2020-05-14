import 'regenerator-runtime/runtime.js';
import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import LocalizationContainer from './localization';
import { App } from './App';
import { isProduction } from './utils/mode';
import createStore from './store';
import rest from './utils/rest';
import { logger } from './utils/logger';

// Styles
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    USSR_DATA: {
      [key: string]: unknown;
    };
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const [, Ussr] = createUssr(window.USSR_DATA);

const store = createStore({
  rest,
  logger,
  initState: window.REDUX_DATA
});

const insertCss = (...styles): () => void => {
  const removeCss = isProduction() ?
    [] :
    styles.map(style => style._insertCss());
  return (): void => removeCss.forEach(dispose => dispose());
};

hydrate(
  <Ussr>
    <Provider store={store}>
      <StyleContext.Provider value={{ insertCss }}>
        <Router history={createBrowserHistory()}>
          <LocalizationContainer>
            <App />
          </LocalizationContainer>
        </Router>
      </StyleContext.Provider>
    </Provider>
  </Ussr>,
  document.getElementById('root')
);
