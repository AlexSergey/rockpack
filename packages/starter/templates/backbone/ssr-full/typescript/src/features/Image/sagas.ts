import {
  call,
  put,
  takeEvery,
  getContext,
} from 'redux-saga/effects';
import {
  fetchImage,
  requestImage,
  requestImageSuccess,
  requestImageError,
} from './actions';

function* fetchImageAsync() {
  try {
    const services = yield getContext('services');
    yield put(requestImage());
    // eslint-disable-next-line camelcase
    const { download_url } = yield call(() => services.image.fetchImage());
    yield put(requestImageSuccess({ url: download_url }));
  } catch (error) {
    yield put(requestImageError());
  }
}

function* watchFetchImage() {
  yield takeEvery(fetchImage, fetchImageAsync);
}

export default watchFetchImage;
