import { createSsr } from '@issr/core';
import { loadableReady } from '@loadable/component';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import { AppState, createStore } from './store';
import './types/global.declaration';

declare global {
  interface Window {
    REDUX_DATA: AppState;
  }
}

const SSR = createSsr();

const store = createStore({
  initialState: window.REDUX_DATA,
});

const router = createBrowserRouter(routes);

loadableReady(() => {
  hydrateRoot(
    document.getElementById('root') as Element,
    <StrictMode>
      <SSR>
        <Provider store={store}>
          <HelmetProvider>
            <RouterProvider router={router} />
          </HelmetProvider>
        </Provider>
      </SSR>
    </StrictMode>,
  );
});
