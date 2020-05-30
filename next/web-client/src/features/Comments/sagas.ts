import fetch from 'node-fetch';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { fetchComments, requestCommentsError, requestCommentsSuccess, requestComments, createComment, commentCreated } from './actions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { increaseComment } from '../PostDetails/actions';
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

type CreateCommentAnswer = { data: { id: number } };

function* createCommentHandler(logger, { payload: { text, user, postId, token } }: ReturnType<typeof createComment>):
Generator<Action, void, CreateCommentAnswer> {
  try {
    const { data } = yield call(() => fetch(`${config.api}/v1/comments/${postId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ text })
    }).then(res => res.json()));

    const comment: Comment = {
      text,
      id: data.id,
      User: {
        email: user.email,
        Role: {
          role: user.role
        }
      }
    };

    yield put(increaseComment());
    yield put(commentCreated(comment));
  } catch (error) {
    yield put(requestCommentsError());
  }
}

function* createCommentSaga(logger): IterableIterator<unknown> {
  yield takeEvery(createComment.type, createCommentHandler, logger);
}

export { commentsSaga, createCommentSaga };
