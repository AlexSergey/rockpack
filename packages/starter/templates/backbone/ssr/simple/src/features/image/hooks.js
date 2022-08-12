import { useSsrEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';

import { fetchImage } from './thunks';

export const useImage = () => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector((state) => state.image);

  useSsrEffect(() => dispatch(fetchImage()));

  return [loading, error, url];
};
