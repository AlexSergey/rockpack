// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactNode } from 'react';
import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../store';
import createMockServices from './mockServices';
import { RootState } from '../types/store';

// eslint-disable-next-line import/prefer-default-export
export const createAppWrapper = ({
  url = '/',
  store,
}: {
  url?: string,
  store?: Store<RootState>,
  initialState?: { [key: string]: unknown }
} = {}):
({ children }: { children: ReactNode }) => JSX.Element => {
  const history = createMemoryHistory({
    initialEntries: [{
      pathname: url,
      key: 'test_key',
    }],
  });

  const SSR = createSsr({}, {
    onlyClient: true,
  });

  const mockedStore = store || createStore({
    initialState,
    history,
    services: createMockServices(),
  }).store;

  // eslint-disable-next-line react/display-name,react/prop-types
  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={mockedStore}>
        <ConnectedRouter history={history}>
          {children}
        </ConnectedRouter>
      </Provider>
    </SSR>
  );
};
