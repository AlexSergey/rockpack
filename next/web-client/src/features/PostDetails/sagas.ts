import fetch from 'node-fetch';
import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPost, requestPost, requestPostError, requestPostSuccess, updatePost, postUpdated } from './actions';
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

function* updatePostHandler(logger, { payload: { postId, title, text, token } }: ReturnType<typeof updatePost>):
Generator<Action, void, any> {
  try {
    yield call(() => fetch(`${config.api}/v1/posts/${postId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        title,
        text
      })
    }));

    yield put(postUpdated({
      title,
      text
    }));
  } catch (error) {
    logger.error(error);
  }
}

function* updatePostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(updatePost.type, updatePostHandler, logger);
}

function* watchPost(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPost.type, fetchPostSaga, logger);
}

export { watchPost, updatePostSaga };
