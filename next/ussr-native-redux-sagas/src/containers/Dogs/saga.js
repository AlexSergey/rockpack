import { fork, all, call, put, takeEvery } from 'redux-saga/effects'
import { requestDog, requestDogSuccess, requestDogError } from './action';
import fetch from 'isomorphic-fetch';

function* watchFetchDog(...args) {
    yield takeEvery('FETCHED_DOG', fetchDogAsync);
}

function* fetchDogAsync(...args) {
    try {
        yield put(requestDog());
        const data = yield call(() => {
                return fetch('https://dog.ceo/api/breeds/image/random')
                    .then(res => res.json())
            }
        );
        yield put(requestDogSuccess(data));
    } catch (error) {
        yield put(requestDogError());
    }
}


export default watchFetchDog;
