import { createReducer } from '@reduxjs/toolkit';
import { requestPosts, requestPostsError, requestPostsSuccess } from './actions';
import { PostsState } from '../../types/Posts';

export const postsReducer = createReducer<PostsState>({
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
