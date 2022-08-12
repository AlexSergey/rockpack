import { requestImage, requestImageSuccess, requestImageError } from './actions';

export const fetchImage =
  () =>
  async (dispatch, getState, { services }) => {
    try {
      dispatch(requestImage());
      const { download_url } = await services.image.fetchImage();
      dispatch(requestImageSuccess({ url: download_url }));
    } catch (error) {
      dispatch(requestImageError());
    }
  };
