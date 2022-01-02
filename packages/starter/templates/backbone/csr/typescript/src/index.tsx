/* eslint-disable import/no-import-module-exports */
import './types/global';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import createStore from './store';
import createServices from './services';

declare global {
  interface Window {
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const store = createStore({
  services: createServices(fetch),
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
