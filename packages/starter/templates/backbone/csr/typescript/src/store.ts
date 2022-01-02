import { configureStore, Store } from '@reduxjs/toolkit';
import { imageReducer } from './features/Image';
import { isDevelopment } from './utils/environments';
import { RootState, StoreProps } from './types/store';

const createStore = ({
  services,
  initialState,
}: StoreProps): Store<RootState> => (
  configureStore({
    reducer: {
      image: imageReducer,
    },
    devTools: isDevelopment(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: false,
      thunk: {
        extraArgument: {
          services,
        },
      },
    }),
    preloadedState: initialState || {},
  })
);

export default createStore;
