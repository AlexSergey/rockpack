import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { isBackend } from '@rockpack/ussr';
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

export const createStore = ({ initState = {}, logger, history, services, testMode }: StoreProps): Store<RootState> => {
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
    preloadedState: initState
  });

  // Localization Sagas
  sagaMiddleware.run(localizationSaga, logger);

  // User Sagas
  sagaMiddleware.run(signInSaga, logger);
  sagaMiddleware.run(signOutSaga, logger);
  sagaMiddleware.run(signUpSaga, logger);
  sagaMiddleware.run(authorizationSaga, logger);

  // Posts Sagas
  sagaMiddleware.run(postsSaga, logger);
  sagaMiddleware.run(setPageSaga, logger);
  sagaMiddleware.run(createPostSaga, logger);
  sagaMiddleware.run(deletePostSaga, logger);

  // Comments Sagas
  sagaMiddleware.run(commentsSaga, logger);
  sagaMiddleware.run(createCommentSaga, logger);
  sagaMiddleware.run(deleteCommentSaga, logger);

  // Post Sagas
  sagaMiddleware.run(watchPost, logger);
  sagaMiddleware.run(updatePostSaga, logger);

  // Users Sagas
  sagaMiddleware.run(usersSaga, logger);
  sagaMiddleware.run(deleteUserSaga, logger);

  return store;
};
