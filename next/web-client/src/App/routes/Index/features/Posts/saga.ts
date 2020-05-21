//@ts-nocheck
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDog, requestDog, requestDogError, requestDogSuccess } from './action';

function* fetchDogAsync(rest, { payload: resolver }) {
  try {
    yield put(requestDog());
    const { data } = yield call(() => rest.get('https://dog.ceo/api/breeds/image/random'));
    yield put(requestDogSuccess({ url: data.message }));
  } catch (error) {
    yield put(requestDogError());
  }
  resolver();
}

function* watchFetchDog(rest) {
  yield takeEvery(fetchDog, fetchDogAsync, rest);
}

export default watchFetchDog;
