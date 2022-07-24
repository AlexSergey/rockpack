/* eslint-disable import/no-import-module-exports */
import './types/global';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router } from './components/Router';
import App from './App';
import createStore from './store';
import createServices from './services';

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
