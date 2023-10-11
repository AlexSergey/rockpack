import { Store, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

export const createStore = ({ history, initialState, services }: IStoreProps): Store<IRootState> => {
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
