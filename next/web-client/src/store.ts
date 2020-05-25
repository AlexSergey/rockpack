import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { promiseMiddleware } from '@adobe/redux-saga-promise';
import { isNotProduction, isProduction } from './utils/mode';
import { localeSaga, localizationReducer as localization } from './features/Localization';
import { watchPosts, postsReducer as posts } from './features/Posts';
import { watchPost, postReducer as post } from './features/PostDetails';
import { commentsSaga, commentsReducer as comments } from './features/Comments';
import { signInSaga, signOutSaga, signUpSaga, userReducer as user } from './features/AuthManager';
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
      posts,
      post,
      comments,
      user
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

  sagaMiddleware.run(localeSaga, logger);
  sagaMiddleware.run(watchPosts, logger);
  sagaMiddleware.run(watchPost, logger);
  sagaMiddleware.run(commentsSaga, logger);
  sagaMiddleware.run(signInSaga, logger);
  sagaMiddleware.run(signOutSaga, logger);
  sagaMiddleware.run(signUpSaga, logger);

  return store;
};
