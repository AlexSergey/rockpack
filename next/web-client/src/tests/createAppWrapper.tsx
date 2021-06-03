import React, { ReactNode } from 'react';
import logger from 'logrock';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';

export const createAppWrapper = ({
  url = '/',
  initialState = {}
}: { url?: string, initialState?: { [key: string]: unknown } } = {}):
  ({ children }: { children: ReactNode }) => JSX.Element => {
  const history = createMemoryHistory({
    initialEntries: [url],
    keyLength: 0
  });

  const SSR = createSsr({}, {
    onlyClient: true
  });

  const store = createStore({
    logger,
    initialState,
    history,
    testMode: true,
    services: createMockServices(),
  });

  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={store}>
        <Router history={history}>
          <LocalizationContainer>
            {children}
          </LocalizationContainer>
        </Router>
      </Provider>
    </SSR>
  );
};
