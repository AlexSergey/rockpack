import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { isBackend } from '@issr/core';
import { isDevelopment } from './utils/environments';
import { localizationReducer as localization } from './features/Localization';
import { userReducer as user } from './features/User';
import { postsReducer as posts, paginationReducer as pagination } from './features/Posts';
import { commentsReducer as comments } from './features/Comments';
import { postReducer as post } from './features/Post';
import { usersReducer as users } from './features/Users';
import { StoreProps, RootState } from './types/store';

export const createStore = ({
  initialState,
  logger,
  history,
  services,
  testMode }: StoreProps): Store<RootState> => {
  const reduxLogger = createLogger({
    collapsed: true
  });

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: {
      extraArgument: {
        services,
        logger,
        history
      }
    },
  });

  if (isDevelopment() && !isBackend() && !testMode) {
    middleware.push(reduxLogger);
  }

  return configureStore({
    reducer: {
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
};
