import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import { createServices } from './services';
import { createStore } from './store';
import './types/global.declaration';

const router = createBrowserRouter(routes);

const store = createStore({
  services: createServices(fetch),
});

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
