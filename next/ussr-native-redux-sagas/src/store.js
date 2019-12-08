import {combineReducers, createStore, compose, applyMiddleware, Store} from 'redux';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './containers/Dog/reducer';
import { ussrSagaRun } from '@rock/ussr/client';
import watchFetchDog from './containers/Dog/saga'

export default ({ reduxState = {}, rest } = {}) => {
    const sagaMiddleware = createSagaMiddleware()
    let store = createStore(combineReducers({
        dogReducer
    }), reduxState, compose(
        applyMiddleware(
            sagaMiddleware,
        ),
    ));
    ussrSagaRun([{
        saga: watchFetchDog,
        args: rest
    }], sagaMiddleware, store);

    return store;
}


