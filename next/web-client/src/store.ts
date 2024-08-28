import { isBackend } from '@issr/core';
import { configureStore, Store } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { commentsReducer as comments } from './features/comments';
import { localizationReducer as localization } from './features/localization';
import { postReducer as post } from './features/post';
import { paginationReducer as pagination, postsReducer as posts } from './features/posts';
import { userReducer as user } from './features/user';
import { usersReducer as users } from './features/users';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ history, initialState, logger, services, testMode }: IStoreProps): Store<IRootState> => {
  return configureStore({
    devTools: isDevelopment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: false,
        thunk: {
          extraArgument: {
            history,
            logger,
            services,
          },
        },
      }).concat(
        isDevelopment() && !isBackend() && !testMode
          ? [
              createLogger({
                collapsed: true,
              }),
            ]
          : [],
      ),
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
