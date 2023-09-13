import { createReducer } from '@reduxjs/toolkit';

import { IActionWithPayload } from '../../types/actions';
import { IComment, ICommentsState } from '../../types/comments';

import {
  requestComments,
  requestCommentsSuccess,
  requestCommentsError,
  commentCreated,
  commentDeleted,
} from './actions';

export const commentsReducer = createReducer<ICommentsState>(
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
      .addCase(requestCommentsSuccess.type, (state, { payload }: IActionWithPayload<IComment[]>) => {
        state.data = payload;
        state.error = false;
        state.loading = false;
      })
      .addCase(requestCommentsError.type, (state) => {
        state.data = [];
        state.error = true;
        state.loading = false;
      })
      .addCase(commentCreated.type, (state, { payload }: IActionWithPayload<IComment>) => {
        state.data.push(payload);
      })
      .addCase(commentDeleted.type, (state, { payload: { id } }: IActionWithPayload<{ id: number }>) => {
        state.data = state.data.filter((s) => s.id !== id);
        state.error = false;
        state.loading = false;
      });
  },
);
