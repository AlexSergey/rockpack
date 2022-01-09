import React, { ReactNode } from 'react';
import logger from 'logrock';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';
import { Router } from '../components/Router';

export const createAppWrapper = ({
  url = '/',
  initialState = {}
}: { url?: string, initialState?: { [key: string]: unknown } } = {}):
  ({ children }: { children: ReactNode }) => JSX.Element => {
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const SSR = createSsr({}, {
    onlyClient: true
  });

  const store = createStore({
    logger,
    initialState,
    testMode: true,
    services: createMockServices(),
    history
  });

  // eslint-disable-next-line react/display-name
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
