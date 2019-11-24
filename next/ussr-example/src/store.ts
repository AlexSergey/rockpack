import {combineReducers, createStore, compose, applyMiddleware, Store} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { middleware as emptyMiddleware } from './utils/empty.middleware';
import { isDevelopment } from './utils/mode';
import { isBackend } from '@rock/ussr/client';
import createSagaMiddleware from 'redux-saga';
import { lessMiddleware, connectSagasToStore } from '@rock/less';

interface StoreLess extends Store {
    detachReducers():any

}
interface ApplicationState {
    router: any;
}
export default (history) => {
    const createStaticReducers = (history) => combineReducers({
        router: connectRouter(history)
    });

    const staticReducers = createStaticReducers(history);

    const sagaMiddleware = createSagaMiddleware();

    //@ts-ignore
    let store = createStore<StoreLess<ApplicationState>>(
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


