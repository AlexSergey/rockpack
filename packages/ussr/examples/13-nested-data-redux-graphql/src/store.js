import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import dogReducer from './Dog/reducer';
import watchFetchDog from './Dog/saga';
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
      dogReducer
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

  sagaMiddleware.run(watchFetchDog, rest);

  return store;
};
