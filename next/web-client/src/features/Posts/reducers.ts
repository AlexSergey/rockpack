import { createReducer } from '@reduxjs/toolkit';

import { IPostsState, Post } from '../../types/posts';

import {
  requestPosts,
  requestPostsError,
  requestPostsSuccess,
  postDeleted,
  paginationSetCount,
  paginationSetCurrent,
} from './actions';

export const postsReducer = createReducer<IPostsState>(
  {
    data: [],
    error: false,
    loading: false,
  },
  {
    [requestPosts.type]: (state) => {
      state.data = [];
      state.error = false;
      state.loading = true;
    },

    [postDeleted.type]: (state, { payload: { id } }: { payload: { id: number } }) => {
      state.data = state.data.filter((post) => post.id !== id);
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
    },
  },
);

export const paginationReducer = createReducer<{ current: number; count: number }>(
  {
    count: 10,
    current: 1,
  },
  {
    [paginationSetCurrent.type]: (state, { payload }: { payload: number }) => {
      state.current = payload;
    },

    [paginationSetCount.type]: (state, { payload }: { payload: number }) => {
      state.count = payload;
    },
  },
);
