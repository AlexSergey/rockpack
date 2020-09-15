import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import imageReducer from './containers/Image/reducer';
import watchFetchImage from './containers/Image/saga';

import { isProduction, isNotProduction } from './utils/mode';

const middleware = getDefaultMiddleware({
  immutableCheck: true,
  serializableCheck: true,
  thunk: false,
});

export default ({ initState = {}, rest } = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      imageReducer
    },
    devTools: isNotProduction(),
    middleware: isProduction() ? middleware.concat([
      sagaMiddleware
    ]) : middleware.concat([
      logger,
      sagaMiddleware
    ]),
    preloadedState: initState
  });

  sagaMiddleware.run(watchFetchImage, rest);

  return store;
};
