import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { fork } from 'redux-saga/effects';
import imageReducer from './containers/Image/reducer';
import watchFetchImage from './containers/Image/saga';
import { isProduction, isNotProduction } from './utils/mode';

export default ({ initState = {}, rest } = {}) => {
  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      imageReducer
    },
    devTools: isNotProduction(),
    middleware: isProduction() ? middleware.concat([
      sagaMiddleware
    ]) : middleware.concat([
      //logger,
      sagaMiddleware
    ]),
    preloadedState: initState
  });

  function* sagas() {
    yield fork(watchFetchImage, rest);
  }

  const rootSaga = sagaMiddleware.run(sagas);

  return { store, rootSaga };
};
