//import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { requestComments, requestCommentsSuccess, requestCommentsError, commentCreated } from './actions';
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
  }),

  [commentCreated.type]: (state, { payload }) => {
    state.data.push(payload);
  }
});
