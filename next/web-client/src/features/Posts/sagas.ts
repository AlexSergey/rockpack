import fetch from 'node-fetch';
import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess, createPost, deletePost, postDeleted } from './actions';
import { Post } from '../../types/Posts';
import config from '../../config';

type Answer = { data: Post[] };

function* fetchPostsSaga(logger, { payload: { resolver } }: ReturnType<typeof fetchPosts>):
Generator<Action, void, Answer> {
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

function* postsSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPosts, fetchPostsSaga, logger);
}

function* createPostHandler(logger, { payload: formData }: ReturnType<typeof createPost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => fetch(`${config.api}/v1/posts`, {
      method: 'POST',
      // @ts-ignore
      credentials: 'include',
      body: formData
    }));

    const { data } = yield call(() => fetch(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* createPostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(createPost, createPostHandler, logger);
}

function* deletePostHandler(logger, { payload: id }: ReturnType<typeof deletePost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => fetch(`${config.api}/v1/posts/${id}`, {
      method: 'DELETE',
      // @ts-ignore
      credentials: 'include'
    }));

    yield put(postDeleted(id));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* deletePostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(deletePost, deletePostHandler, logger);
}

export { postsSaga, createPostSaga, deletePostSaga };
