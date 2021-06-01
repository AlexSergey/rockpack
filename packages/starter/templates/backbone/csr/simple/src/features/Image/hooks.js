import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './thunk';

// eslint-disable-next-line import/prefer-default-export
export const useImage = () => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector((state) => state.image);

  useEffect(() => {
    dispatch(fetchImage());
  }, []);

  return [loading, error, url];
};
