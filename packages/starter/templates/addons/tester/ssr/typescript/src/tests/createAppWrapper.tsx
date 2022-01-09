// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createMemoryHistory } from 'history';
import { Router } from '../components/Router';
import createStore from '../store';
import createMockServices from './mockServices';

// eslint-disable-next-line import/prefer-default-export
export const createAppWrapper = ({
  url = '/',
  initialState,
}: {
  url?: string,
  initialState?: { [key: string]: unknown }
} = {}):
  ({ children }: { children: ReactNode }) => JSX.Element => {
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const SSR = createSsr({}, {
    onlyClient: true,
  });

  const store = createStore({
    initialState,
    history,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name,react/prop-types
  return ({ children }): JSX.Element => (
    <SSR>
      <Provider store={store}>
        <Router history={history}>
          {children}
        </Router>
      </Provider>
    </SSR>
  );
};
