// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from '../components/Router';
import createStore from '../store';
import createMockServices from './mockServices';

// eslint-disable-next-line import/prefer-default-export
export const createAppWrapper = ({
  url = '/',
  initialState,
} = {}) => {
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const store = createStore({
    initialState,
    history,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name,react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      <Router history={history}>
        {children}
      </Router>
    </Provider>
  );
};
