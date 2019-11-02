import { fetchPosts, requestPosts, requestPostsSuccess, requestPostsError } from './Posts.actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchPostsService } from './Posts.service';

function* watchFetchPosts() {
    yield takeEvery(fetchPosts, fetchPostsAsync);
}

function* fetchPostsAsync() {
    try {
        yield put(requestPosts());
        const posts = yield call(fetchPostsService());
        yield put(requestPostsSuccess(posts));
    } catch (error) {
        yield put(requestPostsError());
    }
}

export default watchFetchPosts;
