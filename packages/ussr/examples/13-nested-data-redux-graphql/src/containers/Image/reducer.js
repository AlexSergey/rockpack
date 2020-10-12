import { createReducer } from '@reduxjs/toolkit';
import { requestImage, requestImageSuccess, requestImageError } from './action';

export default createReducer({
  url: '',
  loading: false,
  error: false,
}, {
  [requestImage.type]: () => ({
    url: '',
    loading: true,
    error: false,
  }),
  [requestImageSuccess.type]: (state, { payload }) => ({
    url: payload.url,
    loading: false,
    error: false,
  }),
  [requestImageError.type]: () => ({
    url: '',
    loading: false,
    error: true,
  })
});
