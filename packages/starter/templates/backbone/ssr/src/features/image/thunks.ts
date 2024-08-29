import { ThunkResult } from '../../types/thunk';
import { requestImage, requestImageError, requestImageSuccess } from './actions';

export const fetchImage =
  (): ThunkResult =>
  async (dispatch, getState, { services }) => {
    try {
      dispatch(requestImage());
      const { download_url } = await services.image.fetchImage();
      dispatch(requestImageSuccess({ url: download_url }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(requestImageError());
    }
  };
