import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { imageReducer } from './features/Image';
import { isDevelopment } from './utils/environments';

const createStore = ({
  initialState,
  history,
  services,
}) => {
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
    reducer: {
      image: imageReducer,
    },
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {},
  });
};

export default createStore;
