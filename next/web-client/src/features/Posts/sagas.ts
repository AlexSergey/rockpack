import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess, createPost, deletePost, postDeleted } from './actions';
import { Post } from '../../types/Posts';
import config from '../../config';

type Answer = { data: Post[] };

function* fetchPostsSaga(logger, rest, { payload: { resolver } }: ReturnType<typeof fetchPosts>):
Generator<Action, void, Answer> {
  try {
    yield put(requestPosts());
    const { data } = yield call(() => rest.get(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data));
  } catch (error) {
    yield put(requestPostsError());
  }
  resolver();
}

function* createPostHandler(logger, rest, { payload: { postData } }: ReturnType<typeof createPost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => rest.post(`${config.api}/v1/posts`, postData));

    const { data } = yield call(() => rest.get(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* deletePostHandler(logger, rest, { payload: { id } }: ReturnType<typeof deletePost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => rest.delete(`${config.api}/v1/posts/${id}`));

    yield put(postDeleted(id));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* postsSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchPosts.type, fetchPostsSaga, logger, rest);
}

function* deletePostSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(deletePost.type, deletePostHandler, logger, rest);
}

function* createPostSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(createPost.type, createPostHandler, logger, rest);
}

export { postsSaga, createPostSaga, deletePostSaga };
