import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPost, updatePost } from './actions';
import { PostState, Post } from '../../types/PostDetails';

export const usePost = (postId: number): [boolean, boolean, Post] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ post: PostState }, PostState>(state => state.post);

  useWillMount((resolver) => dispatch(fetchPost({ resolver, postId })));

  return [loading, error, data];
};

export const usePostApi = () => {
  const dispatch = useDispatch();
  return {
    updatePost: (data: any) => {
      dispatch(updatePost(data));
    },
  };
};
