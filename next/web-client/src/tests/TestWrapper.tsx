import { Provider } from 'react-redux';
import React from 'react';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { ConnectedRouter } from 'connected-react-router';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { logger } from '../utils/logger';
import { isProduction } from '../utils/mode';
import { createMockServices } from './mockServices';

export const createTestWrapper = (Component, initState = {}): () => JSX.Element => {
  const history = createBrowserHistory();

  const [, Ussr] = createUssr({}, {
    onlyClient: true
  });

  const store = createStore({
    logger,
    initState,
    history,
    testMode: true,
    services: createMockServices()
  });

  const insertCss = (...styles): () => void => {
    const removeCss = isProduction() ?
      [] :
      styles.map(style => style && typeof style._insertCss === 'function' && style._insertCss());
    return (): void => removeCss.forEach(dispose => dispose());
  };

  return (): JSX.Element => (
    <Ussr>
      <Provider store={store}>
        <StyleContext.Provider value={{ insertCss }}>
          <ConnectedRouter history={history}>
            <LocalizationContainer>
              <Component />
            </LocalizationContainer>
          </ConnectedRouter>
        </StyleContext.Provider>
      </Provider>
    </Ussr>
  );
};
