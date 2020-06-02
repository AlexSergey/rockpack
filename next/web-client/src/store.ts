import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { isBackend } from '@rockpack/ussr';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { isNotProduction } from './utils/mode';
import { createRestClient } from './utils/rest';
import { localizationSaga, localizationReducer as localization } from './features/Localization';
import { authorizationSaga, signInSaga, signUpSaga, signOutSaga, userReducer as user } from './features/User';
import { postsSaga, createPostSaga, deletePostSaga, postsReducer as posts } from './features/Posts';
import { commentsSaga, createCommentSaga, deleteCommentSaga, commentsReducer as comments } from './features/Comments';
import { watchPost, updatePostSaga, postReducer as post } from './features/Post';
import { usersSaga, deleteUserSaga, usersReducer as users } from './features/Users';
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
      user,
      posts,
      comments,
      post,
      users
    },
    devTools: isNotProduction(),
    middleware,
    preloadedState: initState
  });

  // Localization Sagas
  sagaMiddleware.run(localizationSaga, logger, rest);

  // User Sagas
  sagaMiddleware.run(signInSaga, logger, rest);
  sagaMiddleware.run(signOutSaga, logger, rest);
  sagaMiddleware.run(signUpSaga, logger, rest);
  sagaMiddleware.run(authorizationSaga, logger, rest);

  // Posts Sagas
  sagaMiddleware.run(postsSaga, logger, rest);
  sagaMiddleware.run(createPostSaga, logger, rest);
  sagaMiddleware.run(deletePostSaga, logger, rest);

  // Comments Sagas
  sagaMiddleware.run(commentsSaga, logger, rest);
  sagaMiddleware.run(createCommentSaga, logger, rest);
  sagaMiddleware.run(deleteCommentSaga, logger, rest);

  // Post Sagas
  sagaMiddleware.run(watchPost, logger, rest);
  sagaMiddleware.run(updatePostSaga, logger, rest);

  // Users Sagas
  sagaMiddleware.run(usersSaga, logger, rest);
  sagaMiddleware.run(deleteUserSaga, logger, rest);

  return store;
};
