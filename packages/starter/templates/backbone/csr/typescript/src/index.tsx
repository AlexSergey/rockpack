import './types/global.declaration';
import { createBrowserHistory } from 'history';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './app';
import { Router } from './components/router';
import { createServices } from './services';
import { createStore } from './store';

const history = createBrowserHistory();

declare global {
  interface Window {
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const store = createStore({
  history,
  services: createServices(fetch),
});

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
