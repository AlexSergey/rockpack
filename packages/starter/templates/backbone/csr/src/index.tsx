import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import { createStore } from './store';
import './types/global.declaration';

const router = createBrowserRouter(routes);

const store = createStore();

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
