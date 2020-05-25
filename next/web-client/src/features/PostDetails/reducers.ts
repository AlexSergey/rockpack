import { createReducer } from '@reduxjs/toolkit';
import { requestPost, requestPostError, requestPostSuccess } from './actions';
import { PostState } from '../../types/PostDetails';

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
  })
});
