import {
  requestImage,
  requestImageSuccess,
  requestImageError,
} from './actions';
import { ThunkResult } from '../../types/thunk';

// eslint-disable-next-line import/prefer-default-export,max-len
export const fetchImage = (): ThunkResult => async (dispatch, getState, { services }) => {
  try {
    dispatch(requestImage());
    // eslint-disable-next-line camelcase,@typescript-eslint/naming-convention
    const { download_url } = await services.image.fetchImage();
    // eslint-disable-next-line camelcase
    dispatch(requestImageSuccess({ url: download_url }));
  } catch (error) {
    dispatch(requestImageError());
  }
};
