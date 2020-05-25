import fetch from 'node-fetch';
import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess } from './actions';
import { Post } from '../../types/Posts';
import config from '../../config';

type Answer = { data: Post[] };

function* fetchPostsSaga(logger, { payload: { resolver } }: ReturnType<typeof fetchPosts>):
Generator<Action, void, Answer> {
  console.log(logger);
  try {
    yield put(requestPosts());
    const { data } = yield call(() => fetch(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data));
  } catch (error) {
    yield put(requestPostsError());
  }
  resolver();
}

function* watchPosts(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPosts, fetchPostsSaga, logger);
}

export { watchPosts };
