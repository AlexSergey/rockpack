import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { requestComments, requestCommentsSuccess, requestCommentsError, commentCreated, commentDeleted } from './actions';
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

  [commentCreated.type]: (state, { payload }) => (
    produce(state, draftState => {
      draftState.data.push(payload);
    })
  ),

  [commentDeleted.type]: (state, { payload: { id } }) => ({
    data: state.data.filter(s => s.id !== id),
    error: true,
    loading: false
  })
});
