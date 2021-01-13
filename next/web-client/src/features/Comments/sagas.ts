/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { LoggerInterface } from 'logrock';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';
import { fetchComments, requestCommentsError, requestCommentsSuccess, requestComments, createComment, commentCreated, deleteComment, commentDeleted } from './actions';
import { increaseComment, decreaseComment } from '../User';
import { Comment } from '../../types/Comments';
import { ServicesInterface } from '../../services';
import { CommentsRes, CommentRes } from './service';

function* getComments(logger: LoggerInterface, { payload: { postId } }: ReturnType<typeof fetchComments>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    yield put(requestComments());
    const { data }: CommentsRes = yield call(() => (
      services.comments.fetchComments(postId)
    ));
    yield put(requestCommentsSuccess(data));
  } catch (error) {
    logger.error(error, false);
    yield put(requestCommentsError());
  }
}

function* createCommentHandler(logger: LoggerInterface, { payload: { text, user, postId } }:
ReturnType<typeof createComment>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    const { data }: CommentRes = yield call(() => services.comments.createComment(postId, text));

    const comment: Comment = {
      text,
      id: data.id,
      createdAt: new Date().toString(),
      User: {
        id: user.id,
        email: user.email,
        Role: {
          role: user.Role.role
        },
        Statistic: Object.assign({}, user.Statistic)
      }
    };

    yield put(increaseComment());
    yield put(commentCreated(comment));
  } catch (error) {
    logger.error(error, false);
  }
}

function* deleteCommentHandler(logger: LoggerInterface, { payload: { id, owner } }: ReturnType<typeof deleteComment>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    const ownerState = Boolean(owner);
    yield call(() => services.comments.deleteComment(id));

    yield put(commentDeleted({ id }));

    if (ownerState) {
      yield put(decreaseComment());
    }
  } catch (error) {
    logger.error(error, false);
  }
}

function* createCommentSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(createComment.type, createCommentHandler, logger);
}

function* deleteCommentSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(deleteComment.type, deleteCommentHandler, logger);
}

function* commentsSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(fetchComments.type, getComments, logger);
}

export { commentsSaga, createCommentSaga, deleteCommentSaga };
