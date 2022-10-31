import { createReducer } from '@reduxjs/toolkit';

import { IImageState } from '../../types/image';

import { requestImage, requestImageSuccess, requestImageError } from './actions';

export const imageReducer = createReducer<IImageState>(
  {
    error: false,
    loading: false,
    url: '',
  },
  {
    [requestImage.type]: () => ({
      error: false,
      loading: true,
      url: '',
    }),
    [requestImageSuccess.type]: (state, { payload }) => ({
      error: false,
      loading: false,
      url: payload.url,
    }),
    [requestImageError.type]: () => ({
      error: true,
      loading: false,
      url: '',
    }),
  },
);
