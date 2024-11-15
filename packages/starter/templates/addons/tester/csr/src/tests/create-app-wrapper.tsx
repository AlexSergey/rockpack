import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { AppState, createStore } from '../store';

export const createAppWrapper = ({
  initialState,
  url = '/',
}: {
  initialState?: AppState;
  url?: string;
} = {}): (({ children }: { children: ReactNode }) => ReactNode) => {
  const store = createStore({
    initialState,
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
