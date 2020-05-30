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

function* createPostHandler(logger, { payload: { postData, token } }: ReturnType<typeof createPost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => fetch(`${config.api}/v1/posts`, {
      headers: {
        Authorization: token
      },
      method: 'POST',
      body: postData
    }));

    const { data } = yield call(() => fetch(`${config.api}/v1/posts`)
      .then(res => res.json()));

    yield put(requestPostsSuccess(data));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* deletePostHandler(logger, { payload: { id, token } }: ReturnType<typeof deletePost>):
Generator<Action, void, Answer> {
  try {
    yield call(() => fetch(`${config.api}/v1/posts/${id}`, {
      headers: {
        Authorization: token
      },
      method: 'DELETE'
    }));

    yield put(postDeleted(id));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* postsSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPosts.type, fetchPostsSaga, logger);
}

function* deletePostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(deletePost.type, deletePostHandler, logger);
}

function* createPostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(createPost.type, createPostHandler, logger);
}

export { postsSaga, createPostSaga, deletePostSaga };
