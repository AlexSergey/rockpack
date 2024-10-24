import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { createStore } from '../store';
import { createMockServices } from './mock-services';

export const createAppWrapper = ({
  initialState = {},
  url = '/',
}: {
  initialState?: Record<string, unknown>;
  url?: string;
} = {}): (({ children }: { children: ReactNode }) => ReactNode) => {
  const store = createStore({
    initialState,
    services: createMockServices(),
  });

  // eslint-disable-next-line react/display-name
  return ({ children }): ReactNode => {
    const router = createMemoryRouter([
      {
        element: children,
        path: url,
      },
    ]);

    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };
};
