import { createReducer } from '@reduxjs/toolkit';
import { requestPosts, requestPostsError, requestPostsSuccess } from './actions';

export const postsReducer = createReducer({
  data: [],
  error: false,
  loading: false
}, {
  [requestPosts.type]: () => ({
    data: [],
    error: false,
    loading: true
  }),

  [requestPostsSuccess.type]: (state, { payload }) => ({
    data: payload,
    error: false,
    loading: false
  }),
  [requestPostsError.type]: () => ({
    data: [],
    error: true,
    loading: false
  })
});
