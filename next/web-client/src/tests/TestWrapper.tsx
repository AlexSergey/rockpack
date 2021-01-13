import React from 'react';
import logger from 'logrock';
import { Store } from '@reduxjs/toolkit';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';
import { RootState } from '../types/store';

export const createTestWrapper = async (Component: React.ComponentType<Record<string, unknown>>, initState = {}):
Promise<{
  wrapper: ReactWrapper<unknown, unknown, unknown>;
  store: Store<RootState>;
}> => {
  const history = createBrowserHistory();

  const [SSR] = createSsr({}, {
    onlyClient: true
  });

  const { store } = createStore({
    logger,
    initState,
    history,
    testMode: true,
    services: createMockServices(),
  });

  const TestWrapper = (): JSX.Element => (
    <SSR>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LocalizationContainer>
            <Component />
          </LocalizationContainer>
        </ConnectedRouter>
      </Provider>
    </SSR>
  );

  const wrapper = mount(<TestWrapper />);

  return {
    wrapper,
    store
  };
};
