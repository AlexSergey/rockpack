import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import logger from 'logrock';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { Router } from '../components/Router';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';

import { createMockServices } from './mock-services';

export const createAppWrapper = ({
  url = '/',
  initialState = {},
}: { url?: string; initialState?: { [key: string]: unknown } } = {}): (({
  children,
}: {
  children: ReactNode;
}) => JSX.Element) => {
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const SSR = createSsr(
    {},
    {
      onlyClient: true,
    },
  );

  const store = createStore({
    history,
    initialState,
    logger,
    services: createMockServices(),
    testMode: true,
  });

  // eslint-disable-next-line react/display-name
  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={store}>
        <Router history={history}>
          <LocalizationContainer>{children}</LocalizationContainer>
        </Router>
      </Provider>
    </SSR>
  );
};
