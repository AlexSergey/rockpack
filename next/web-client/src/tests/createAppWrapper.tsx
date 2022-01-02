import React, { ReactNode } from 'react';
import logger from 'logrock';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { MemoryRouter } from 'react-router-dom';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';

export const createAppWrapper = ({
  url = '/',
  initialState = {}
}: { url?: string, initialState?: { [key: string]: unknown } } = {}):
  ({ children }: { children: ReactNode }) => JSX.Element => {
  const SSR = createSsr({}, {
    onlyClient: true
  });

  const store = createStore({
    logger,
    initialState,
    testMode: true,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name
  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={store}>
        <MemoryRouter initialEntries={[url]} initialIndex={0}>
          <LocalizationContainer>
            {children}
          </LocalizationContainer>
        </MemoryRouter>
      </Provider>
    </SSR>
  );
};
