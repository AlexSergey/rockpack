import { useSsrEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';

import { IPostState, Post } from '../../types/post';

import { fetchPost, updatePost } from './thunks';

export const usePost = (postId: number): [boolean, boolean, Post] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ post: IPostState }, IPostState>((state) => state.post);

  useSsrEffect(() => dispatch(fetchPost(postId)));

  return [loading, error, data];
};

export const usePostApi = (): {
  updatePost: (post: { postId: number; title: string; text: string }) => void;
} => {
  const dispatch = useDispatch();

  return {
    updatePost: (post): void => {
      dispatch(updatePost(post));
    },
  };
};
