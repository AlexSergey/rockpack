import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPost } from './actions';
import { PostState, Post } from '../../types/PostDetails';

export const usePost = (postId: string): [boolean, boolean, Post] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ post: PostState }, PostState>(state => state.post);

  console.log('data, error, loading', data, error, loading);

  useWillMount((resolver) => dispatch(fetchPost({ resolver, postId })));

  return [loading, error, data];
};
