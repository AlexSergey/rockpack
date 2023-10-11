import { createMemoryHistory } from 'history';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { Router } from '../components/router';
import { createStore } from '../store';
import { createMockServices } from './mock-services';

export const createAppWrapper = ({
  initialState = {},
  url = '/',
}: {
  initialState?: { [key: string]: unknown };
  url?: string;
} = {}): (({ children }: { children: ReactNode }) => JSX.Element) => {
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const store = createStore({
    history,
    initialState,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name
  return ({ children }): JSX.Element => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
};
