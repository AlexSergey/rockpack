import React from 'react';
import { hydrate } from 'react-dom';
import Cookies from 'js-cookie';
import createUssr from '@rockpack/ussr';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { LocalizationContainer } from './features/Localization';
import { CookiesContainer } from './features/IsomorphicCookies';
import { App } from './main';
import { isProduction } from './utils/mode';
import { createStore } from './store';
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

const history = createBrowserHistory();

const [, Ussr] = createUssr(window.USSR_DATA);

const store = createStore({
  logger,
  initState: window.REDUX_DATA,
  history
});

const insertCss = (...styles): () => void => {
  const removeCss = isProduction() ?
    [] :
    styles.map(style => style && typeof style._insertCss === 'function' && style._insertCss());
  return (): void => removeCss.forEach(dispose => dispose());
};

hydrate(
  <CookiesContainer getCookies={(field) => Cookies.get(field)}>
    <Ussr>
      <Provider store={store}>
        <StyleContext.Provider value={{ insertCss }}>
          <ConnectedRouter history={history}>
            <LocalizationContainer>
              <App />
            </LocalizationContainer>
          </ConnectedRouter>
        </StyleContext.Provider>
      </Provider>
    </Ussr>
  </CookiesContainer>,
  document.getElementById('root')
);
