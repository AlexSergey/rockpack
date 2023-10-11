import { Store, configureStore } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ history, initialState, services }: IStoreProps): Store<IRootState> =>
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
