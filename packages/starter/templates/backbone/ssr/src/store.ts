import { combineReducers, configureStore, EnhancedStore, ThunkDispatch } from '@reduxjs/toolkit';
import { Action } from 'redux';

import { imageReducer } from './features/image/image.slice';
import { isDevelopment } from './utils/environments';

const rootReducer = combineReducers({
  image: imageReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type Dispatcher = ThunkDispatch<AppState, void, Action>;

export const createStore = (props?: { initialState?: AppState | undefined }): EnhancedStore<AppState> =>
  configureStore({
    devTools: isDevelopment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: false,
      }),
    preloadedState: props?.initialState || {},
    reducer: rootReducer,
  });
