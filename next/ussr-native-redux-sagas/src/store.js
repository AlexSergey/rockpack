import {combineReducers, createStore, compose, applyMiddleware, Store} from 'redux';
import createSagaMiddleware from 'redux-saga';
import dogsReducer from './containers/Dogs/reducer';
import { ussrSagaRun } from '@rock/ussr/client';
import watchFetchDog from './containers/Dogs/saga'

export default ({ reduxState = {}, rest } = {}) => {
    const sagaMiddleware = createSagaMiddleware()
    let store = createStore(combineReducers({
        dogsReducer
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


