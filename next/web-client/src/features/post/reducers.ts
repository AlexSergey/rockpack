import { createReducer } from '@reduxjs/toolkit';

import { ActionWithPayload } from '../../types/actions';
import { Post, PostState } from '../../types/post';
import { commentCreated, commentDeleted } from '../comments';
import { postUpdated, requestPost, requestPostError, requestPostSuccess } from './actions';

export const postReducer = createReducer<PostState>(
  {
    data: null,
    error: false,
    loading: false,
  },
  (builder) => {
    builder
      .addCase(requestPost.type, (state) => {
        state.data = null;
        state.error = false;
        state.loading = true;
      })
      .addCase(requestPostSuccess.type, (state, { payload }: ActionWithPayload<Post>) => {
        state.data = payload;
        state.error = false;
        state.loading = false;
      })
      .addCase(requestPostError.type, (state) => {
        state.data = null;
        state.error = true;
        state.loading = false;
      })
      .addCase(postUpdated.type, (state, { payload }: ActionWithPayload<Post>) => {
        state.data.title = payload.title;
        state.data.text = payload.text;
      })
      .addCase(commentCreated.type, (state) => {
        state.data.Statistic.comments += 1;
      })
      .addCase(commentDeleted.type, (state) => {
        state.data.Statistic.comments -= 1;
      });
  },
);
