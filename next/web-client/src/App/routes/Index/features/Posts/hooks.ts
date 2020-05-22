import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from './actions';
import { PostsState, Post } from './types';

export const usePosts = (): [boolean, boolean, Post[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>(state => state.posts);

  console.log('data, error, loading', data, error, loading);

  useWillMount((resolver) => dispatch(fetchPosts({ resolver })));

  return [loading, error, data];
};
