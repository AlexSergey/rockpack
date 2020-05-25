import { createReducer } from '@reduxjs/toolkit';
import { requestComments, requestCommentsSuccess, requestCommentsError } from './actions';
import { CommentsState } from '../../types/Comments';

export const commentsReducer = createReducer<CommentsState>({
  data: [],
  error: false,
  loading: false
}, {
  [requestComments.type]: () => ({
    data: [],
    error: false,
    loading: true
  }),

  [requestCommentsSuccess.type]: (state, { payload }) => ({
    data: payload,
    error: false,
    loading: false
  }),
  [requestCommentsError.type]: () => ({
    data: [],
    error: true,
    loading: false
  })
});
