import { isBackend } from '@issr/core';
import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { commentsReducer as comments } from './features/Comments';
import { localizationReducer as localization } from './features/Localization';
import { postReducer as post } from './features/Post';
import { postsReducer as posts, paginationReducer as pagination } from './features/Posts';
import { userReducer as user } from './features/User';
import { usersReducer as users } from './features/Users';
import { IStoreProps, IRootState } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ initialState, logger, history, services, testMode }: IStoreProps): Store<IRootState> => {
  const reduxLogger = createLogger({
    collapsed: true,
  });

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: {
      extraArgument: {
        history,
        logger,
        services,
      },
    },
  });

  if (isDevelopment() && !isBackend() && !testMode) {
    middleware.push(reduxLogger);
  }

  return configureStore({
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {},
    reducer: {
      comments,
      localization,
      pagination,
      post,
      posts,
      user,
      users,
    },
  });
};
