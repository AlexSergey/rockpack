import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './containers/Dog/reducer';
import logger from 'redux-logger';

import { isProduction, isNotProduction } from './utils/mode';

const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
});

export default ({ reduxState = {} } = {}) => {
    const sagaMiddleware = createSagaMiddleware();

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

    return {
        ...store,
        runSaga: sagaMiddleware.run
    };
}


