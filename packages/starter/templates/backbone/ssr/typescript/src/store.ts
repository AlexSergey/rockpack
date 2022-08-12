import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ initialState, services, history }: IStoreProps): Store<IRootState> => {
  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: {
      extraArgument: {
        history,
        services,
      },
    },
  });

  return configureStore({
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {},
    reducer: {
      image: imageReducer,
    },
  });
};
