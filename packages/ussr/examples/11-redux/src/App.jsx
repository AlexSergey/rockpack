import React from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import Dogs from './containers/Dog';
import createStore from './store';
import watchFetchDog from './containers/Dog/saga';

export const App = (() => {
  const instance = axios.create({
    url: 'http://localhost:6000',
    timeout: 1000
  });
  
  const store = createStore({
    reduxState: window.REDUX_DATA
  });
  
  store.runSaga(watchFetchDog, instance)
    .toPromise();
  
  return () => (
    <Provider store={store}>
      <Dogs />
    </Provider>
  );
})();
