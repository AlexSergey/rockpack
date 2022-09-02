import { createSsr } from '@issr/core';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

import { Router } from '../components/router';
import { createStore } from '../store';

import { createMockServices } from './mock-services';

export const createAppWrapper = ({ url = '/', initialState = {} } = {}) => {
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
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name,react/prop-types
  return ({ children }) => (
    <SSR>
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    </SSR>
  );
};
