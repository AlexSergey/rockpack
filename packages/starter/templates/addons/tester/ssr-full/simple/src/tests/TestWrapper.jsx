import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../store';
import createMockServices from './mockServices';

const createTestWrapper = async (Component, initState = {}) => {
  const history = createBrowserHistory();

  const [Ussr] = createUssr({}, {
    onlyClient: true,
  });

  const { store } = createStore({
    initState,
    history,
    services: createMockServices(),
  });

  const TestWrapper = () => (
    <Ussr>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </Ussr>
  );

  const wrapper = mount(<TestWrapper />);

  return {
    wrapper,
    store,
  };
};

export default createTestWrapper;
