import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchImage, requestImage, requestImageSuccess, requestImageError } from './action';

function* watchFetchImage(rest) {
  yield takeEvery(fetchImage.type, fetchImageAsync, rest);
}

function* fetchImageAsync(rest, { payload: resolve }) {
  try {
    yield put(requestImage());
    const { data } = yield call(() => rest.get('https://picsum.photos/id/0/info'));
    yield put(requestImageSuccess({ url: data.download_url }));
  } catch (error) {
    yield put(requestImageError());
  }
  resolve();
}

export default watchFetchImage;
