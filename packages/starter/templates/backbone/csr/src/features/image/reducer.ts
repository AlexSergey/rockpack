import { createReducer } from '@reduxjs/toolkit';

import { ImageState } from '../../types/image';
import { requestImage, requestImageError, requestImageSuccess } from './actions';

export const imageReducer = createReducer<ImageState>(
  {
    error: false,
    loading: false,
    url: '',
  },
  (builder) => {
    builder.addCase(requestImage, (state) => {
      state.error = false;
      state.loading = true;
      state.url = '';
    });
    builder.addCase(requestImageSuccess, (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.url = payload.url;
    });
    builder.addCase(requestImageError, (state) => {
      state.error = true;
      state.loading = false;
      state.url = '';
    });
  },
);
