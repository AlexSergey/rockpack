import React, { ReactNode } from 'react';
import logger from 'logrock';
import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';
import { RootState } from '../types/store';

export const createAppWrapper = ({
  url = '/',
  store,
  initialState = {}
}: { url?: string, store?: Store<RootState>, initialState?: { [key: string]: unknown } } = {}):
  ({ children }: { children: ReactNode }) => JSX.Element => {
  const history = createMemoryHistory({
    initialEntries: [{
      pathname: url,
      key: 'test_key',
    }],
  });

  const SSR = createSsr({}, {
    onlyClient: true
  });

  const mockedStore = store || createStore({
    logger,
    initialState,
    history,
    testMode: true,
    services: createMockServices(),
  }).store;

  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={mockedStore}>
        <Router history={history}>
          <LocalizationContainer>
            {children}
          </LocalizationContainer>
        </Router>
      </Provider>
    </SSR>
  );
};
