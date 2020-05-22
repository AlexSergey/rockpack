import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { promiseMiddleware } from '@adobe/redux-saga-promise';
import { isNotProduction, isProduction } from './utils/mode';
import { watchFetchLocale, localizationReducer as localization } from './localization';
import { watchPosts, postsReducer as posts } from './App/routes/Index/features/Posts';
import { StoreProps, RootState } from './types/store';

const reduxLogger = createLogger({
  collapsed: true
});

const middleware = getDefaultMiddleware({
  immutableCheck: true,
  serializableCheck: false,
  thunk: false,
});

middleware.push(promiseMiddleware);

export const createStore = ({ initState = {}, logger }: StoreProps): Store<RootState> => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      localization,
      posts
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

  sagaMiddleware.run(watchFetchLocale, logger);
  sagaMiddleware.run(watchPosts, logger);

  return store;
};
