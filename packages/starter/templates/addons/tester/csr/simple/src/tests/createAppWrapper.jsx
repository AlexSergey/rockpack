// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createStore from '../store';
import createMockServices from './mockServices';

// eslint-disable-next-line import/prefer-default-export
export const createAppWrapper = ({
  url = '/',
  initialState,
} = {}) => {
  const store = createStore({
    initialState,
    history,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name,react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]} initialIndex={0}>
        {children}
      </MemoryRouter>
    </Provider>
  );
};
