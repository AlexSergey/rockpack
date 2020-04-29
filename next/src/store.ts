import { AxiosInstance } from 'axios';
import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { isNotProduction, isProduction } from './utils/mode';
import localization, { LocalizationState } from './localization/reducer';

const middleware = getDefaultMiddleware({
  immutableCheck: true,
  serializableCheck: true,
  thunk: false,
});

interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  rest: AxiosInstance;
}

export interface RootState {
  localization: LocalizationState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ initState = {}, rest }: StoreProps): Store<RootState> => {
  const sagaMiddleware = createSagaMiddleware();
  return configureStore({
    reducer: {
      localization
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
};
