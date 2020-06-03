import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { requestPost, requestPostError, requestPostSuccess, postUpdated } from './actions';
import { commentCreated, commentDeleted } from '../Comments';
import { PostState } from '../../types/Post';

export const postReducer = createReducer<PostState>({
  data: null,
  error: false,
  loading: false
}, {
  [requestPost.type]: () => ({
    data: null,
    error: false,
    loading: true
  }),

  [requestPostSuccess.type]: (state, { payload }) => ({
    data: payload,
    error: false,
    loading: false
  }),

  [requestPostError.type]: () => ({
    data: null,
    error: true,
    loading: false
  }),

  [postUpdated.type]: (state, { payload }) => (
    produce(state, draftState => {
      draftState.data.title = payload.title;
      draftState.data.text = payload.text;
    })
  ),

  [commentCreated.type]: (state) => (
    produce(state, draftState => {
      draftState.data.Statistic.comments += 1;
    })
  ),

  [commentDeleted.type]: (state) => (
    produce(state, draftState => {
      draftState.data.Statistic.comments -= 1;
    })
  )
});
