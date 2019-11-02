import { createAction } from 'redux-act';

const fetchPosts = createAction('fetch posts from server');
const requestPosts = createAction('get posts from end point');
const requestPostsSuccess = createAction('posts was downloaded successful');
const requestPostsError = createAction('posts error loading');

export { fetchPosts, requestPosts, requestPostsSuccess, requestPostsError };
