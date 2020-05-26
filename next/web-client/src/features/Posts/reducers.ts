import { createReducer } from '@reduxjs/toolkit';
import { requestPosts, requestPostsError, requestPostsSuccess, postDeleted } from './actions';
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

  [postDeleted.type]: (state, { payload }) => ({
    data: state.data.filter(post => post.id !== payload),
    error: false,
    loading: false
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
