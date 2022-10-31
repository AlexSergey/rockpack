import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IImageState } from '../../types/image';
import { Dispatcher } from '../../types/store';

import { fetchImage } from './thunks';

export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch<Dispatcher>();
  const { url, error, loading } = useSelector<
    {
      image: IImageState;
    },
    IImageState
  >((state) => state.image);

  useEffect(() => {
    dispatch(fetchImage());
  }, []);

  return [loading, error, url];
};
