import { configureStore } from '@reduxjs/toolkit';
import { imageReducer } from './features/Image';
import { isDevelopment } from './utils/environments';

const createStore = ({
  history,
  services,
  initialState,
}) => (
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
          history,
          services,
        },
      },
    }),
    preloadedState: initialState || {},
  })
);

export default createStore;
