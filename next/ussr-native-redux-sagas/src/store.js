import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './containers/Dog/reducer';
import { ussrSagas } from '@rock/ussr/client';
import watchFetchDog from './containers/Dog/saga';
import logger from 'redux-logger';

import { isProduction, isNotProduction } from './utils/mode';

const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
});

export default ({ reduxState = {}, rest } = {}) => {
    const sagaMiddleware = createSagaMiddleware()

    let store = configureStore({
        reducer: {
            dogReducer
        },
        devTools: isNotProduction,
        middleware: isProduction ? middleware.concat([
            sagaMiddleware
        ]) : middleware.concat([
            logger,
            sagaMiddleware
        ]),
        preloadedState: reduxState
    });

    ussrSagas(store, [
        sagaMiddleware.run(watchFetchDog, rest).toPromise()
    ]);

    return store;
}


