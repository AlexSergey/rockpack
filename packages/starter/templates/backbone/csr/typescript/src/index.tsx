import './types/global.declaration';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';
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

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
