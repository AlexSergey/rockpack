import { configureStore, Store } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ services, initialState, history }: IStoreProps): Store<IRootState> =>
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
