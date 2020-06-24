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
  [requestPosts.type]: (state) => {
    state.data = [];
    state.error = false;
    state.loading = true;
  },

  [postDeleted.type]: (state, { payload: { id } }: { payload: { id: number }}) => {
    state.data = state.data.filter(post => post.id !== id);
    state.error = false;
    state.loading = false;
  },

  [requestPostsSuccess.type]: (state, { payload }: { payload: Post[] }) => {
    state.data = payload;
    state.error = false;
    state.loading = false;
  },

  [requestPostsError.type]: (state) => {
    state.data = [];
    state.error = true;
    state.loading = false;
  }
});

export const paginationReducer = createReducer<{ current: number; count: number }>({
  current: 1,
  count: 10
}, {
  [paginationSetCurrent.type]: (state, { payload }: { payload: number }) => {
    state.current = payload;
  },

  [paginationSetCount.type]: (state, { payload }: { payload: number }) => {
    state.count = payload;
  }
});
