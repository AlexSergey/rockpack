import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { imageReducer } from './features/Image';
import { isDevelopment } from './utils/environments';
import { RootState, StoreProps } from './types/store';

const createStore = ({
  initialState,
  services,
  history,
}: StoreProps): Store<RootState> => {
  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: {
      extraArgument: {
        services,
        history,
      },
    },
  });

  return configureStore({
    reducer: {
      image: imageReducer,
    },
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {},
  });
};

export default createStore;
