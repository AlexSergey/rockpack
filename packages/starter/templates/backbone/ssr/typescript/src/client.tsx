import './types/global';
import fetch from 'node-fetch';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import { HelmetProvider } from 'react-helmet-async';
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

const SSR = createSsr();

const store = createStore({
  initialState: window.REDUX_DATA,
  services: createServices(fetch),
});

loadableReady(() => {
  hydrate(
    <SSR>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </SSR>,
    document.getElementById('root'),
  );
});
