import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { imageReducer, watchFetchImage } from './features/Image';
import { isDevelopment } from './utils/environments';

const createStore = ({
  initialState,
  history,
  services,
}) => {
  const sagaMiddleware = createSagaMiddleware({
    context: {
      services,
    },
  });

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: false,
  });

  middleware.push(sagaMiddleware);
  middleware.push(routerMiddleware(history));

  const store = configureStore({
    reducer: {
      router: connectRouter(history),
      image: imageReducer,
    },
    devTools: isDevelopment(),
    middleware,
    preloadedState: initialState || {},
  });

  function* sagas() {
    yield fork(watchFetchImage);
  }

  const rootSaga = sagaMiddleware.run(sagas);

  return { store, rootSaga };
};

export default createStore;
