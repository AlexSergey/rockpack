import { useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './actions';

const useImage = () => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector((state) => state.image);

  useUssrEffect(() => dispatch(fetchImage()));

  return [loading, error, url];
};

export default useImage;
