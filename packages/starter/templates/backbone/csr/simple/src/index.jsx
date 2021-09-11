import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

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

if (module.hot) {
  module.hot.accept();
}
