import React from 'react';
import logger from 'logrock';
import { Store } from '@reduxjs/toolkit';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { LocalizationContainer } from '../features/Localization';
import { createStore } from '../store';
import { createMockServices } from './mockServices';
import { RootState } from '../types/store';

export const createTestWrapper = async (Component, initState = {}): Promise<{
  wrapper: ReactWrapper<{}, {}, {}>;
  store: Store<RootState>;
}> => {
  const history = createBrowserHistory();

  const [Ussr] = createUssr({}, {
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
    <Ussr>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LocalizationContainer>
            <Component />
          </LocalizationContainer>
        </ConnectedRouter>
      </Provider>
    </Ussr>
  );

  const wrapper = mount(<TestWrapper />);

  return {
    wrapper,
    store
  };
};
