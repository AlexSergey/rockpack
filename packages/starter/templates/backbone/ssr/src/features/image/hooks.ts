import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { IImageState } from '../../types/image';
import { Dispatcher } from '../../types/store';
import { fetchImage } from './thunks';

export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch<Dispatcher>();
  const { error, loading, url } = useSelector<
    {
      image: IImageState;
    },
    IImageState
  >((state) => state.image);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchImage());
  }, []);

  return [loading, error, url];
};
