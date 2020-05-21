//@ts-nocheck
import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDog } from './action';

const usePosts = () => {
  const dispatch = useDispatch();
  const dog = useSelector(state => state.dogReducer);

  useWillMount((resolver) => dispatch(fetchDog(resolver)));

  return [dog.loading, dog.error, dog.url];
};

export default usePosts;
