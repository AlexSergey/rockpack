import { createReducer } from '@reduxjs/toolkit';
import { requestImage, requestImageSuccess, requestImageError } from './actions';
import { ImageState } from '../../types/Image';

const imageReducer = createReducer<ImageState>({
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
  }),
});

export default imageReducer;
