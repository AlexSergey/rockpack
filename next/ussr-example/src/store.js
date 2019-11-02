import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { middleware as emptyMiddleware } from './utils/empty.middleware';
import { isDevelopment } from './utils/mode';
import { isBackend } from '@rock/ussr/client';
import createSagaMiddleware from 'redux-saga';
import { lessMiddleware, connectSagasToStore } from '@rock/less';

export default (history) => {
    const createStaticReducers = (history) => combineReducers({
        router: connectRouter(history)
    });

    const staticReducers = createStaticReducers(history);

    const sagaMiddleware = createSagaMiddleware();

    let store = createStore(
        staticReducers,
        compose(
            applyMiddleware(
                sagaMiddleware,
                routerMiddleware(history),
                (isDevelopment && !isBackend()) ? createLogger({
                    collapsed: true
                }) : emptyMiddleware
            ),
            lessMiddleware(sagaMiddleware)
        )
    );

    connectSagasToStore(sagaMiddleware, store);

    return store;
}


