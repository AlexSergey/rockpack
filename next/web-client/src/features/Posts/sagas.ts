/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { push } from 'connected-react-router';
import { call, put, takeEvery, takeLatest, getContext } from 'redux-saga/effects';
import { fetchPosts, requestPosts, requestPostsError, requestPostsSuccess, createPost, deletePost, postDeleted, paginationSetCount, paginationSetCurrent, settingPage } from './actions';
import { increasePost, decreasePost, decreaseComment } from '../User';
import { ServicesInterface } from '../../services';
import { PostsRes, DeletePostRes } from './service';

function* fetchPostsHandler(logger, { payload: { page } }: ReturnType<typeof fetchPosts>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    yield put(requestPosts());
    const { data: { posts, count } }: PostsRes = yield call(() => services.posts.fetchPosts(page));
    yield put(paginationSetCount(count));
    yield put(requestPostsSuccess(posts));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* setPageHandler(logger, { payload: { currentLanguage, page } }: ReturnType<typeof settingPage>) {
  try {
    yield put(paginationSetCurrent(page));
    yield put(push(`/${currentLanguage}/?page=${page}`));
  } catch (error) {
    logger.error(error);
  }
}

function* createPostHandler(logger, { payload: { postData, page } }: ReturnType<typeof createPost>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    yield call(() => services.posts.createPost(postData));

    const { data: { posts, count } }: PostsRes = yield call(() => services.posts.fetchPosts(page));

    yield put(increasePost());
    yield put(paginationSetCount(count));
    yield put(requestPostsSuccess(posts));
  } catch (error) {
    yield put(requestPostsError());
  }
}

function* deletePostHandler(logger, { payload: { id, owner } }: ReturnType<typeof deletePost>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    const ownerState = Boolean(owner);
    const { data: { deleteComments } }: DeletePostRes = yield call(() => services.posts.deletePost(id));

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

function* postsSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchPosts.type, fetchPostsHandler, logger);
}

function* deletePostSaga(logger): IterableIterator<unknown> {
  yield takeLatest(deletePost.type, deletePostHandler, logger);
}

function* setPageSaga(logger): IterableIterator<unknown> {
  yield takeLatest(settingPage.type, setPageHandler, logger);
}

function* createPostSaga(logger): IterableIterator<unknown> {
  yield takeEvery(createPost.type, createPostHandler, logger);
}

export { postsSaga, createPostSaga, deletePostSaga, setPageSaga };
