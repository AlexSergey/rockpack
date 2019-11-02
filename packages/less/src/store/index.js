import dynostore, { dynamicReducers }  from '@redux-dynostore/core';
import { dynamicSagas } from '@redux-dynostore/redux-saga';
import { isObject, isFunction, isPromise } from 'valid-types';
import { END } from 'redux-saga';

const idGenerator = () => {
    return {n: 0};
};

export const connectSagasToStore = (sagaMiddleware, store) => {
    let idGen = idGenerator();
    let run = sagaMiddleware.run;
    let sagas = {};

    sagaMiddleware.run = function(...args) {
        let id = `id_${++idGen.n}`;
        let sagaWasRunning = run.apply(this, args);
        let cancel = sagaWasRunning.cancel;
        sagaWasRunning.cancel = function(...args) {
            delete sagas[id];
            return cancel.apply(this, args);
        };
        sagas[id] = sagaWasRunning;
        return sagaWasRunning;
    };

    store.getSagas = () => sagas;

    store.waitSagas = () => {
        let res = Object.keys(sagas)
            .map(sagaName => isObject(sagas[sagaName]) && isFunction(sagas[sagaName].toPromise) ?
                sagas[sagaName].toPromise() :
                false)
            .filter(saga => isObject(saga));

        store.dispatch(END);

        return res;
    };

    return sagaMiddleware;
};

export const lessMiddleware = (sagaMiddleware) => {
    if (isFunction(sagaMiddleware)) {
        return dynostore(
            dynamicReducers(),
            dynamicSagas(sagaMiddleware)
        );
    }
    return dynostore(
        dynamicReducers()
    );
};

