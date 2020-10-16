import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, ReactWrapper } from 'enzyme';
import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createUssr from '@rockpack/ussr';
import { createBrowserHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../store';
import createMockServices from './mockServices';
import { RootState } from '../types/store';

const createTestWrapper = async (Component, initState = {}): Promise<{
  wrapper: ReactWrapper<{}, {}, {}>;
  store: Store<RootState>;
}> => {
  const history = createBrowserHistory();

  const [Ussr] = createUssr({}, {
    onlyClient: true,
  });

  const { store } = createStore({
    initState,
    history,
    services: createMockServices(),
  });

  const TestWrapper = (): JSX.Element => (
    <Ussr>
      <Provider store={store}>
        <StyleContext.Provider value={{ insertCss: (): () => void => (): void => {} }}>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </StyleContext.Provider>
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
