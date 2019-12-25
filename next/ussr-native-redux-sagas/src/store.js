import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './containers/Dog/reducer';
import { ussrSagas } from '@rock/ussr/client';
import watchFetchDog from './containers/Dog/saga';
import logger from 'redux-logger';

import { isProduction, isNotProduction } from './utils/mode';

export default ({ reduxState = {}, rest } = {}) => {
    const sagaMiddleware = createSagaMiddleware()

    let store = configureStore({
        reducer: {
            dogReducer
        },
        devTools: isNotProduction,
        middleware: isProduction ?
            [
                sagaMiddleware
            ] : [
                logger,
                sagaMiddleware
            ],
        preloadedState: reduxState
    });

    ussrSagas(store, [
        sagaMiddleware.run(watchFetchDog, rest).toPromise()
    ]);

    return store;
}


