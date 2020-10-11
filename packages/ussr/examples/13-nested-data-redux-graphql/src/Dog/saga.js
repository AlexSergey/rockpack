import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDog, requestDog, requestDogError, requestDogSuccess } from './action';

function* watchFetchDog() {
  yield takeEvery(fetchDog, fetchDogAsync);
}

function* fetchDogAsync({ payload: resolver }) {
  try {
    yield put(requestDog());
    const { data } = yield call(() => (
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              message: 'https://images.dog.ceo/breeds/bullterrier-staffordshire/n02093256_9796.jpg',
              status: 'success'
            }
          });
        }, 1000);
      })
    ));
    console.log(data);
    yield put(requestDogSuccess({ url: data.message }));
  } catch (error) {
    yield put(requestDogError());
  }
  resolver();
}

export default watchFetchDog;
