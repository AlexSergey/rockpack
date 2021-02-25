import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, ReactWrapper } from 'enzyme';
import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../store';
import createMockServices from './mockServices';
import { RootState } from '../types/store';

const createTestWrapper = async (Component: React.ComponentType<Record<string, unknown>>): Promise<{
  wrapper: ReactWrapper<unknown, unknown, unknown>;
  store: Store<RootState>;
}> => {
  const history = createBrowserHistory();

  const { store } = createStore({
    history,
    services: createMockServices(),
  });

  const TestWrapper = (): JSX.Element => (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>
  );

  const wrapper = mount(<TestWrapper />);

  return {
    wrapper,
    store,
  };
};

export default createTestWrapper;
