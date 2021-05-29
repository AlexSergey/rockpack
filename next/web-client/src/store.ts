import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware, { Task } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { createLogger } from 'redux-logger';
import { isBackend } from '@issr/core';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { isDevelopment } from './utils/environments';
import { localizationSaga, localizationReducer as localization } from './features/Localization';
import { authorizationSaga, signInSaga, signUpSaga, signOutSaga, userReducer as user } from './features/User';
import { postsSaga, createPostSaga, deletePostSaga, setPageSaga, postsReducer as posts, paginationReducer as pagination } from './features/Posts';
import { commentsSaga, createCommentSaga, deleteCommentSaga, commentsReducer as comments } from './features/Comments';
import { watchPost, updatePostSaga, postReducer as post } from './features/Post';
import { usersSaga, deleteUserSaga, usersReducer as users } from './features/Users';
import { StoreProps, RootState } from './types/store';
import { ServicesInterface } from './services';

export const createStore = ({
  initialState,
  logger,
  history,
  services,
  testMode }: StoreProps): { store: Store<RootState>; rootSaga: Task } => {
  const reduxLogger = createLogger({
    collapsed: true
  });

  const sagaMiddleware = createSagaMiddleware<{ services: ServicesInterface }>({
    context: {
      services
    }
  });

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: false,
  });

  middleware.push(sagaMiddleware);
  middleware.push(routerMiddleware(history));

  if (isDevelopment() && !isBackend() && !testMode) {
    middleware.push(reduxLogger);
  }

  const store = configureStore({
    reducer: {
      router: connectRouter(history),
      localization,
      user,
      posts,
      comments,
      post,
      users,
      pagination
    },
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {}
  });

  function* sagas(): Generator<unknown> {
    yield fork(localizationSaga, logger);
    yield fork(signInSaga, logger);
    yield fork(signOutSaga, logger);
    yield fork(signUpSaga, logger);
    yield fork(authorizationSaga, logger);
    yield fork(postsSaga, logger);
    yield fork(setPageSaga, logger);
    yield fork(createPostSaga, logger);
    yield fork(deletePostSaga, logger);
    yield fork(commentsSaga, logger);
    yield fork(createCommentSaga, logger);
    yield fork(deleteCommentSaga, logger);
    yield fork(watchPost, logger);
    yield fork(updatePostSaga, logger);
    yield fork(usersSaga, logger);
    yield fork(deleteUserSaga, logger);
  }

  const rootSaga = sagaMiddleware.run(sagas);

  return { store, rootSaga };
};
