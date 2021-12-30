import {
  requestImage,
  requestImageSuccess,
  requestImageError,
} from './actions';

// eslint-disable-next-line import/prefer-default-export
export const fetchImage = () => async (dispatch, getState, { services }) => {
  try {
    dispatch(requestImage());
    // eslint-disable-next-line camelcase
    const { download_url } = await services.image.fetchImage();
    // eslint-disable-next-line camelcase
    dispatch(requestImageSuccess({ url: download_url }));
  } catch (error) {
    dispatch(requestImageError());
  }
};
