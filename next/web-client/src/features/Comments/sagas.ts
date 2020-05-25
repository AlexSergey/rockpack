import fetch from 'node-fetch';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { fetchComments, requestCommentsError, requestCommentsSuccess, requestComments } from './actions';
import { Comment } from '../../types/Comments';
import config from '../../config';

type Answer = { data: Comment[] };

function* getComments(logger, { payload: { resolver, postId } }: ReturnType<typeof fetchComments>):
Generator<Action, void, Answer> {
  try {
    yield put(requestComments());
    const { data } = yield call(() => (
      fetch(`${config.api}/v1/comments/${postId}`)
        .then(res => res.json())
    ));
    yield put(requestCommentsSuccess(data));
  } catch (error) {
    yield put(requestCommentsError());
  }
  resolver();
}

function* commentsSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchComments.type, getComments, logger);
}

export { commentsSaga };
