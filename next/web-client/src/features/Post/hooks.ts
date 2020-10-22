import { useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPost, updatePost } from './actions';
import { PostState, Post } from '../../types/Post';

export const usePost = (postId: number): [boolean, boolean, Post] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ post: PostState }, PostState>(state => state.post);

  useUssrEffect(() => dispatch(fetchPost({ postId })));

  return [loading, error, data];
};

export const usePostApi = (): {
  updatePost: (post: { postId: number; title: string; text: string }) => void;
} => {
  const dispatch = useDispatch();
  return {
    updatePost: (post) => {
      dispatch(updatePost({ post }));
    },
  };
};
