import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatcher } from '../../store';
import { fetchImage, getImageState } from './image.slice';

export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch<Dispatcher>();
  const { error, loading, url } = useSelector(getImageState);

  useEffect(() => {
    dispatch(fetchImage());
  }, []);

  return [loading, error, url];
};
