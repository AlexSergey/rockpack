import { createReducer } from '@reduxjs/toolkit';

import { IActionWithPayload } from '../../types/actions';
import { IPost, IPostsState } from '../../types/posts';
import {
  paginationSetCount,
  paginationSetCurrent,
  postDeleted,
  requestPosts,
  requestPostsError,
  requestPostsSuccess,
} from './actions';

export const postsReducer = createReducer<IPostsState>(
  {
    data: [],
    error: false,
    loading: false,
  },
  (builder) => {
    builder
      .addCase(requestPosts.type, (state) => {
        state.data = [];
        state.error = false;
        state.loading = true;
      })
      .addCase(postDeleted.type, (state, { payload: { id } }: IActionWithPayload<{ id: number }>) => {
        state.data = state.data.filter((post) => post.id !== id);
        state.error = false;
        state.loading = false;
      })
      .addCase(requestPostsSuccess.type, (state, { payload }: IActionWithPayload<IPost[]>) => {
        state.data = payload;
        state.error = false;
        state.loading = false;
      })
      .addCase(requestPostsError.type, (state) => {
        state.data = [];
        state.error = true;
        state.loading = false;
      });
  },
);

export const paginationReducer = createReducer<{ count: number; current: number }>(
  {
    count: 10,
    current: 1,
  },
  (builder) => {
    builder
      .addCase(paginationSetCurrent.type, (state, { payload }: IActionWithPayload<number>) => {
        state.current = payload;
      })
      .addCase(paginationSetCount.type, (state, { payload }: IActionWithPayload<number>) => {
        state.count = payload;
      });
  },
);
