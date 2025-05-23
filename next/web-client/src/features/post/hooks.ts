import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { Post, PostState } from '../../types/post';
import { ThunkResult } from '../../types/thunk';
import { fetchPost, updatePost } from './thunks';

export const usePost = (postId: number): [boolean, boolean, Post] => {
  const dispatch = useDispatch<ThunkResult>();
  const { data, error, loading } = useSelector<{ post: PostState }, PostState>((state) => state.post);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchPost(postId));
  }, [postId]);

  return [loading, error, data];
};

export const usePostApi = (): {
  updatePost: (post: { postId: number; text: string; title: string }) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    updatePost: (post): void => {
      dispatch(updatePost(post));
    },
  };
};
