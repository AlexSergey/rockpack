import { createReducer } from '@reduxjs/toolkit';

import { ActionWithPayload } from '../../types/actions';
import { Comment, CommentsState } from '../../types/comments';
import {
  commentCreated,
  commentDeleted,
  requestComments,
  requestCommentsError,
  requestCommentsSuccess,
} from './actions';

export const commentsReducer = createReducer<CommentsState>(
  {
    data: [],
    error: false,
    loading: false,
  },
  (builder) => {
    builder
      .addCase(requestComments.type, (state) => {
        state.data = [];
        state.error = false;
        state.loading = true;
      })
      .addCase(requestCommentsSuccess.type, (state, { payload }: ActionWithPayload<Comment[]>) => {
        state.data = payload;
        state.error = false;
        state.loading = false;
      })
      .addCase(requestCommentsError.type, (state) => {
        state.data = [];
        state.error = true;
        state.loading = false;
      })
      .addCase(commentCreated.type, (state, { payload }: ActionWithPayload<Comment>) => {
        state.data.push(payload);
      })
      .addCase(commentDeleted.type, (state, { payload: { id } }: ActionWithPayload<{ id: number }>) => {
        state.data = state.data.filter((s) => s.id !== id);
        state.error = false;
        state.loading = false;
      });
  },
);
