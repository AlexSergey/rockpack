import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
//import dogReducer from './containers/Dog/reducer';

import { isProduction, isNotProduction } from './utils/mode';

const middleware = getDefaultMiddleware({
  immutableCheck: true,
  serializableCheck: true,
  thunk: false,
});

export default ({ initState = {} } = {}): unknown => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      // dogReducer
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

  return {
    ...store,
    runSaga: sagaMiddleware.run
  };
};
