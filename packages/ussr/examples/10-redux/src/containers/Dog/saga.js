import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDog, requestDog, requestDogError, requestDogSuccess } from './action';

function* watchFetchDog(rest) {
  yield takeEvery(fetchDog, fetchDogAsync, rest);
}

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

export default watchFetchDog;
