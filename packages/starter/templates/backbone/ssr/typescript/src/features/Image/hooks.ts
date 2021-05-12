import { useSsrEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './actions';
import { ImageState } from '../../types/Image';

export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector<{
    image: ImageState;
  }, ImageState>((state) => state.image);

  useSsrEffect(() => dispatch(fetchImage()));

  return [loading, error, url];
};
