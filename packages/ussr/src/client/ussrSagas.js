import { END } from 'redux-saga';

const ussrSagas = (store, promises) => {
    promises = Array.isArray(promises) ? promises : [promises];

    let effects = promises
        .map(promise => typeof promise.then === 'function' ? promise : false)
        .filter(promise => !!promise);

    store.effects = () => {
        store.dispatch(END);
        return effects;
    };
};

export default ussrSagas;
