import { fork, all, call, put, takeEvery } from 'redux-saga/effects'
import { requestDog, requestDogSuccess, requestDogError } from './action';

function* watchFetchDog(rest) {
    yield takeEvery('FETCHED_DOG', fetchDogAsync, rest);
}

function* fetchDogAsync(rest, action) {
    try {
        yield put(requestDog());
        const { data } = yield call(() => rest.get('https://dog.ceo/api/breeds/image/random'));
        yield put(requestDogSuccess(data));
    } catch (error) {
        console.log(error);
        yield put(requestDogError());
    }
}


export default watchFetchDog;
