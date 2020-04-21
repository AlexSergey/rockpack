import React from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import Dogs from './containers/Dog';
import watchFetchDog from './containers/Dog/saga';
import { useApplyEffects } from '../../../src';

export const App = ({ store }) => {
  const instance = axios.create({
    url: 'http://localhost:6000',
    timeout: 1000
  });

  const effects = store.runSaga(watchFetchDog, instance)
    .toPromise();

  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useApplyEffects(() => effects);

    return (
      <Provider store={store}>
        <Dogs />
      </Provider>
    );
  };
};
