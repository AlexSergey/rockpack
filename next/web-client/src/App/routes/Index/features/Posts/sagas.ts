import fetch from 'node-fetch';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess } from './actions';
import config from '../../../../../config';

// eslint-disable-next-line require-yield
function* fetchPostsSaga(logger, { payload }) {
  console.log(logger);
  try {
    yield put(requestPosts());
    const { data } = yield call(() => fetch(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data.posts));
  } catch (error) {
    yield put(requestPostsError());
  }
  payload.resolver();
}

function* watchPosts(logger): IterableIterator<unknown> {
  // @ts-ignore
  yield takeEvery(fetchPosts, fetchPostsSaga, logger);
}

export { watchPosts };
