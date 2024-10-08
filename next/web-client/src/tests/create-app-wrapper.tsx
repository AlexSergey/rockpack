import { createSsr } from '@issr/core';
import { createMemoryHistory } from 'history';
import logger from 'logrock';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { Router } from '../components/router';
import { LocalizationContainer } from '../features/localization';
import { createStore } from '../store';
import { createMockServices } from './mock-services';

export const createAppWrapper = ({
  initialState = {},
  url = '/',
}: { initialState?: Record<string, unknown>; url?: string } = {}): (({
  children,
}: {
  children: ReactNode;
}) => ReactElement) => {
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
  return ({ children }): ReactElement => (
    <SSR>
      <Provider store={store}>
        <Router history={history}>
          <LocalizationContainer>{children}</LocalizationContainer>
        </Router>
      </Provider>
    </SSR>
  );
};
