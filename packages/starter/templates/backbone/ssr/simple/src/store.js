import { configureStore } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { isDevelopment } from './utils/environments';

export const createStore = ({ initialState, services, history }) =>
  configureStore({
    devTools: isDevelopment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: false,
        thunk: {
          extraArgument: {
            history,
            services,
          },
        },
      }),
    preloadedState: initialState || {},
    reducer: {
      image: imageReducer,
    },
  });
