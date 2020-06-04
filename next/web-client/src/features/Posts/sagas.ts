import { Action } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess, createPost, deletePost, postDeleted, paginationSetCount, paginationSetCurrent, settingPage } from './actions';
import { increasePost, decreasePost, decreaseComment } from '../User';
import { Post } from '../../types/Posts';
import config from '../../config';

function* fetchPostsHandler(logger, rest, { payload: { resolver, page } }: ReturnType<typeof fetchPosts>):
Generator<Action, void, { data: { posts: Post[]; count: number } }> {
  try {
    yield put(requestPosts());
    const { data: { posts, count } } = yield call(() => rest.get(`${config.api}/v1/posts?page=${page}`));
    yield put(paginationSetCount(count));
    yield put(requestPostsSuccess(posts));
  } catch (error) {
    yield put(requestPostsError());
  }
  if (typeof resolver === 'function') {
    resolver();
  }
}

function* setPageHandler(logger, rest, { payload: { currentLanguage, page } }: ReturnType<typeof settingPage>):
Generator<Action, void, void> {
  try {
    yield put(paginationSetCurrent(page));
    yield put(push(`/${currentLanguage}/?page=${page}`));
  } catch (error) {
    logger.error(error);
  }
}

function* createPostHandler(logger, rest, { payload: { postData } }: ReturnType<typeof createPost>):
Generator<Action, void, { data: { posts: Post[]; count: number } }> {
  try {
    yield call(() => rest.post(`${config.api}/v1/posts`, postData));

    const { data: { posts, count } } = yield call(() => rest.get(`${config.api}/v1/posts`));

    yield put(increasePost());
    yield put(paginationSetCount(count));
    yield put(requestPostsSuccess(posts));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* deletePostHandler(logger, rest, { payload: { id, owner } }: ReturnType<typeof deletePost>):
Generator<Action, void, { data: { deleteComments: number[] } }> {
  try {
    const ownerState = Boolean(owner);
    const { data: { deleteComments } } = yield call(() => rest.delete(`${config.api}/v1/posts/${id}`));

    if (Array.isArray(deleteComments) && deleteComments.length > 0) {
      for (let i = 0, l = deleteComments.length; i < l; i++) {
        yield put(decreaseComment());
      }
    }

    if (ownerState) {
      yield put(decreasePost());
    }

    yield put(postDeleted({ id }));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* postsSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchPosts.type, fetchPostsHandler, logger, rest);
}

function* deletePostSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(deletePost.type, deletePostHandler, logger, rest);
}

function* setPageSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(settingPage.type, setPageHandler, logger, rest);
}

function* createPostSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(createPost.type, createPostHandler, logger, rest);
}

export { postsSaga, createPostSaga, deletePostSaga, setPageSaga };
