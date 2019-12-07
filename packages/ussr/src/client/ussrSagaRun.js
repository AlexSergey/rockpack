import { END } from 'redux-saga';

const ussrSagaRun = (sagas, sagaMiddleware, store) => {
    sagas = Array.isArray(sagas) ? sagas : [sagas];

    let promises = sagas
        .map(s => {
            let promise = false;

            if (s.saga && s.args) {
                let args = Array.isArray(s.args) ? s.args : [s.args];
                promise = sagaMiddleware.run(s.saga, args).toPromise();
            }
            else {
                promise = sagaMiddleware.run(s).toPromise();
            }

            return promise;

        })
        .filter(p => typeof p.then === 'function');

    store.effects = () => {
        store.dispatch(END);
        return promises;
    };
};

export default ussrSagaRun;
