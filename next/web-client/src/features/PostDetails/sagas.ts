import fetch from 'node-fetch';
import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchPost, requestPost, requestPostError, requestPostSuccess } from './actions';
import { Post } from '../../types/PostDetails';
import config from '../../config';

type Answer = { data: Post };

function* fetchPostSaga(logger, { payload: { resolver, postId } }: ReturnType<typeof fetchPost>):
Generator<Action, void, Answer> {
  try {
    yield put(requestPost());
    const { data } = yield call(() => fetch(`${config.api}/v1/posts/${postId}`)
      .then(res => res.json()));
    yield put(requestPostSuccess(data));
  } catch (error) {
    yield put(requestPostError());
  }
  resolver();
}

function* watchPost(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPost, fetchPostSaga, logger);
}

export { watchPost };
