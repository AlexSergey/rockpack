import { createReducer } from '@reduxjs/toolkit';
import { requestPosts, requestPostsError, requestPostsSuccess, postDeleted, paginationSetCount, paginationSetCurrent } from './actions';
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

  [postDeleted.type]: (state, { payload: { id } }) => ({
    data: state.data.filter(post => post.id !== id),
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

export const paginationReducer = createReducer<{ current: number; count: number }>({
  current: 1,
  count: 10
}, {
  [paginationSetCurrent.type]: (state, { payload }) => ({
    current: payload,
    count: state.count
  }),

  [paginationSetCount.type]: (state, { payload }) => ({
    current: state.current,
    count: payload
  })
});
