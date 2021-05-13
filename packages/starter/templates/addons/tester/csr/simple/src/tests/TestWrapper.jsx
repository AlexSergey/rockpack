// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../store';
import createMockServices from './mockServices';

const createTestWrapper = async (Component) => {
  const history = createBrowserHistory();

  const { store } = createStore({
    history,
    services: createMockServices(),
  });

  const TestWrapper = () => (
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
