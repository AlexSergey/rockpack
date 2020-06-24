import { createReducer } from '@reduxjs/toolkit';
import { requestPost, requestPostError, requestPostSuccess, postUpdated } from './actions';
import { commentCreated, commentDeleted } from '../Comments';
import { PostState } from '../../types/Post';

export const postReducer = createReducer<PostState>({
  data: null,
  error: false,
  loading: false
}, {
  [requestPost.type]: (state) => {
    state.data = null;
    state.error = false;
    state.loading = true;
  },

  [requestPostSuccess.type]: (state, { payload }) => {
    state.data = payload;
    state.error = false;
    state.loading = false;
  },

  [requestPostError.type]: (state) => {
    state.data = null;
    state.error = true;
    state.loading = false;
  },

  [postUpdated.type]: (state, { payload }) => {
    state.data.title = payload.title;
    state.data.text = payload.text;
  },

  [commentCreated.type]: (state) => {
    state.data.Statistic.comments += 1;
  },

  [commentDeleted.type]: (state) => {
    state.data.Statistic.comments -= 1;
  },
});
