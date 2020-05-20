import { AxiosInstance } from 'axios';
import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { Logger } from '@rockpack/logger';
import { promiseMiddleware } from '@adobe/redux-saga-promise';
import { isNotProduction, isProduction } from './utils/mode';
import localization, { LocalizationState } from './localization/reducer';

import watchFetchLocale from './localization/saga';

const reduxLogger = createLogger({
  collapsed: true
});

const middleware = getDefaultMiddleware({
  immutableCheck: true,
  serializableCheck: false,
  thunk: false,
});

middleware.push(promiseMiddleware);

interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  rest: AxiosInstance;
  logger: Logger;
}

export interface RootState {
  localization: LocalizationState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ initState = {}, rest, logger }: StoreProps): Store<RootState> => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      localization
    },
    devTools: isNotProduction(),
    middleware: isProduction() ? middleware.concat([
      sagaMiddleware
    ]) : middleware.concat([
      reduxLogger,
      sagaMiddleware
    ]),
    preloadedState: initState
  });

  sagaMiddleware.run(watchFetchLocale, rest, logger);

  return store;
};
