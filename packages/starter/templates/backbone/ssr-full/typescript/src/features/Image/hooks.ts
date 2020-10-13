import { useWillMount, useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './actions';

const useImage = () => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector((state) => state.image);

  const effect = useUssrEffect('image');
  useWillMount(effect, () => dispatch(fetchImage()));

  return [loading, error, url];
};

export default useImage;
