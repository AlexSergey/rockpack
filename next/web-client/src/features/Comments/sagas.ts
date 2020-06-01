import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { fetchComments, requestCommentsError, requestCommentsSuccess, requestComments, createComment, commentCreated, deleteComment, commentDeleted } from './actions';
import { increaseComment, decreaseComment } from '../_common/actions';
import { Comment } from '../../types/Comments';
import config from '../../config';

type Answer = { data: Comment[] };

function* getComments(logger, rest, { payload: { resolver, postId } }: ReturnType<typeof fetchComments>):
Generator<Action, void, Answer> {
  try {
    yield put(requestComments());
    const { data } = yield call(() => (
      rest.get(`${config.api}/v1/comments/${postId}`)
    ));
    yield put(requestCommentsSuccess(data));
  } catch (error) {
    yield put(requestCommentsError());
  }
  resolver();
}

type CreateCommentAnswer = { data: { id: number } };

function* createCommentHandler(logger, rest, { payload: { text, user, postId } }: ReturnType<typeof createComment>):
Generator<Action, void, CreateCommentAnswer> {
  try {
    const { data } = yield call(() => rest.post(`${config.api}/v1/comments/${postId}`, { text }));

    const comment: Comment = {
      text,
      id: data.id,
      createdAt: new Date(),
      User: {
        id: user.id,
        email: user.email,
        Role: {
          role: user.role
        },
        Statistic: Object.assign({}, user.Statistic)
      }
    };

    yield put(increaseComment());
    yield put(commentCreated(comment));
  } catch (error) {
    yield put(requestCommentsError());
  }
}

function* deleteCommentHandler(logger, rest, { payload: { id } }: ReturnType<typeof deleteComment>):
Generator<Action, void, any> {
  try {
    yield call(() => rest.delete(`${config.api}/v1/comments/${id}`));

    yield put(decreaseComment());
    yield put(commentDeleted(id));
  } catch (error) {
    logger.error(error);
  }
}

function* createCommentSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(createComment.type, createCommentHandler, logger, rest);
}

function* deleteCommentSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(deleteComment.type, deleteCommentHandler, logger, rest);
}

function* commentsSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchComments.type, getComments, logger, rest);
}

export { commentsSaga, createCommentSaga, deleteCommentSaga };
