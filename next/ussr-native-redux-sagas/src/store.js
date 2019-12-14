import {combineReducers, createStore, compose, applyMiddleware, Store} from 'redux';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './containers/Dog/reducer';
import { ussrSagas } from '@rock/ussr/client';
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

    ussrSagas(store, [
        sagaMiddleware.run(watchFetchDog, rest).toPromise()
    ]);

    return store;
}


