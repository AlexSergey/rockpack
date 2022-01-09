import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './thunks';
import { ImageState } from '../../types/Image';
import { Dispatcher } from '../../types/store';

// eslint-disable-next-line import/prefer-default-export
export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch<Dispatcher>();
  const { url, error, loading } = useSelector<{
    image: ImageState;
  }, ImageState>((state) => state.image);

  useEffect(() => {
    dispatch(fetchImage());
  }, []);

  return [loading, error, url];
};
