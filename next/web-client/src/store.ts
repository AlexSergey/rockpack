import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { isBackend } from '@rockpack/ussr';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { isNotProduction } from './utils/mode';
import { createRestClient } from './utils/rest';
import { localeSaga, localizationReducer as localization } from './features/Localization';
import { postsSaga, createPostSaga, deletePostSaga, postsReducer as posts } from './features/Posts';
import { watchPost, updatePostSaga, postReducer as post } from './features/PostDetails';
import { commentsSaga, createCommentSaga, deleteCommentSaga, commentsReducer as comments } from './features/Comments';
import { authorizationSaga, signInSaga, signOutSaga, signUpSaga, authReducer as auth } from './features/AuthManager';
import { usersSaga, deleteUserSaga, usersReducer as users } from './features/Users';
import { userStatisticReducer as userStatistic } from './features/UserStatistic';
import { StoreProps, RootState } from './types/store';

export const createStore = ({ initState = {}, logger, history, getToken }: StoreProps): Store<RootState> => {
  const rest = createRestClient(getToken);
  const reduxLogger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: false,
  });

  middleware.push(sagaMiddleware);
  middleware.push(routerMiddleware(history));

  if (isNotProduction() && !isBackend()) {
    middleware.push(reduxLogger);
  }

  const store = configureStore({
    reducer: {
      router: connectRouter(history),
      localization,
      posts,
      post,
      comments,
      auth,
      userStatistic,
      users
    },
    devTools: isNotProduction(),
    middleware,
    preloadedState: initState
  });

  sagaMiddleware.run(localeSaga, logger, rest);
  sagaMiddleware.run(postsSaga, logger, rest);
  sagaMiddleware.run(createPostSaga, logger, rest);
  sagaMiddleware.run(deletePostSaga, logger, rest);
  sagaMiddleware.run(updatePostSaga, logger, rest);
  sagaMiddleware.run(watchPost, logger, rest);
  sagaMiddleware.run(commentsSaga, logger, rest);
  sagaMiddleware.run(createCommentSaga, logger, rest);
  sagaMiddleware.run(deleteCommentSaga, logger, rest);
  sagaMiddleware.run(signInSaga, logger, rest);
  sagaMiddleware.run(signOutSaga, logger, rest);
  sagaMiddleware.run(signUpSaga, logger, rest);
  sagaMiddleware.run(authorizationSaga, logger, rest);
  sagaMiddleware.run(usersSaga, logger, rest);
  sagaMiddleware.run(deleteUserSaga, logger, rest);

  return store;
};
