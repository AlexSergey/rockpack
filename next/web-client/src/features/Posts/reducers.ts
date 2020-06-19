import { createReducer } from '@reduxjs/toolkit';
import {
  requestPosts,
  requestPostsError,
  requestPostsSuccess,
  postDeleted,
  paginationSetCount,
  paginationSetCurrent,
} from './actions';
import { PostsState, Post } from '../../types/Posts';

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

  [postDeleted.type]: (state, { payload: { id } }: { payload: { id: number }}) => ({
    data: state.data.filter(post => post.id !== id),
    error: false,
    loading: false
  }),

  [requestPostsSuccess.type]: (state, { payload }: { payload: Post[] }) => ({
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
  [paginationSetCurrent.type]: (state, { payload }: { payload: number }) => ({
    current: payload,
    count: state.count
  }),

  [paginationSetCount.type]: (state, { payload }: { payload: number }) => ({
    current: state.current,
    count: payload
  })
});
