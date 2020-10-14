import { SagaIterator } from '@redux-saga/core';
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

function* fetchImageAsync(): SagaIterator {
  try {
    const services = yield getContext('services');
    yield put(requestImage());
    // eslint-disable-next-line max-len
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase,@typescript-eslint/naming-convention
    const { download_url } = yield call(() => services.image.fetchImage());
    // eslint-disable-next-line @typescript-eslint/camelcase
    yield put(requestImageSuccess({ url: download_url }));
  } catch (error) {
    yield put(requestImageError());
  }
}

function* watchFetchImage(): IterableIterator<unknown> {
  yield takeEvery(fetchImage, fetchImageAsync);
}

export default watchFetchImage;
