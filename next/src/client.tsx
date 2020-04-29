import React, { ReactText } from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rock/ussr';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { LoggerContainer } from '@rock/log';
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { Localization } from './localization';
import { App } from './App';
import { isProduction } from './utils/mode';
import createStore from './store';
import rest from './utils/rest';

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
  initState: window.REDUX_DATA
});

const insertCss = (...styles): () => void => {
  const removeCss = isProduction() ?
    [] :
    styles.map(style => style._insertCss());
  return (): void => removeCss.forEach(dispose => dispose());
};

const notify = (): ReactText => toast('Wow so easy !');

hydrate(
  <LoggerContainer stdout={notify}>
    <>
      <Ussr>
        <Provider store={store}>
          <StyleContext.Provider value={{ insertCss }}>
            <Router history={createBrowserHistory()}>
              <Localization>
                {(props): JSX.Element => <App {...props} />}
              </Localization>
            </Router>
          </StyleContext.Provider>
        </Provider>
      </Ussr>
      <ToastContainer />
    </>
  </LoggerContainer>,
  document.getElementById('root')
);
