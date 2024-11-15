import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';

import { imageService } from './image.service';

const createSlice = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

export interface ImageSlice {
  error: boolean;
  loading: boolean;
  url: string;
}

const imageSlice = createSlice({
  initialState: {
    error: false,
    loading: false,
    url: '',
  } as ImageSlice,
  name: 'image',
  reducers: (create) => ({
    fetchImage: create.asyncThunk(imageService.fetchImage, {
      fulfilled: (state, { payload }) => {
        state.url = payload.data.download_url;
        state.error = false;
        state.loading = false;
      },
      pending: (state) => {
        state.loading = true;
        state.error = false;
        state.url = '';
      },
      rejected: (state) => {
        state.loading = false;
        state.error = true;
        state.url = '';
      },
    }),
  }),
  selectors: {
    getImageState: (state) => state,
  },
});

export const imageReducer = imageSlice.reducer;

export const { fetchImage } = imageSlice.actions;
export const { getImageState } = imageSlice.selectors;
