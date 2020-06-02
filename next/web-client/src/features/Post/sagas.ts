import { Action } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPost, requestPost, requestPostError, requestPostSuccess, updatePost, postUpdated } from './actions';
import { Post } from '../../types/Post';
import config from '../../config';

function* fetchPostSaga(logger, rest, { payload: { resolver, postId } }: ReturnType<typeof fetchPost>):
Generator<Action, void, { data: Post }> {
  try {
    yield put(requestPost());
    const { data } = yield call(() => rest.get(`${config.api}/v1/posts/${postId}`));
    yield put(requestPostSuccess(data));
  } catch (error) {
    yield put(requestPostError());
  }
  resolver();
}

function* updatePostHandler(logger, rest, { payload: { post } }: ReturnType<typeof updatePost>):
Generator<Action, void, void> {
  try {
    yield call(() => rest.put(`${config.api}/v1/posts/${post.postId}`, {
      title: post.title,
      text: post.text
    }));

    yield put(postUpdated({
      title: post.title,
      text: post.text
    }));
  } catch (error) {
    logger.error(error);
  }
}

function* updatePostSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(updatePost.type, updatePostHandler, logger, rest);
}

function* watchPost(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchPost.type, fetchPostSaga, logger, rest);
}

export { watchPost, updatePostSaga };
