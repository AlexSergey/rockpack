import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';

import { imageReducer } from './features/image';
import { IRootState, IStoreProps } from './types/store';
import { isDevelopment } from './utils/environments';

const rootReducer = combineReducers({
  image: imageReducer,
});

export const createStore = ({ initialState, services }: IStoreProps): Store<IRootState> => {
  return configureStore({
    devTools: isDevelopment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: false,
        thunk: {
          extraArgument: {
            services,
          },
        },
      }),
    preloadedState: initialState || {},
    reducer: rootReducer,
  });
};
