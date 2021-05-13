import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

const { store } = createStore({
  history,
  services: createServices(fetch),
});

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
