import { createSsr } from '@issr/core';
import { loadableReady } from '@loadable/component';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import { createServices } from './services';
import { createStore } from './store';
import './types/global.declaration';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    REDUX_DATA: Record<string, unknown>;
  }
}

const SSR = createSsr();

const store = createStore({
  initialState: window.REDUX_DATA,
  services: createServices(fetch),
});
const router = createBrowserRouter(routes);

loadableReady(() => {
  hydrateRoot(
    document.getElementById('root') as Element,
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </Provider>
    </SSR>,
  );
});
