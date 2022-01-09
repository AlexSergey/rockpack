import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserHistory } from 'history';
import { Router } from './components/Router';
import App from './App';
import createStore from './store';
import createServices from './services';

const history = createBrowserHistory();

const SSR = createSsr();

const store = createStore({
  history,
  initialState: window.REDUX_DATA,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <Router history={history}>
            <App />
          </Router>
        </HelmetProvider>
      </Provider>
    </SSR>,
    document.getElementById('root'),
  );
});
