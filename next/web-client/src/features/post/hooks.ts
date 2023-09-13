import { useSsrEffect, useRegisterEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';

import { IPostState, IPost } from '../../types/post';
import { ThunkResult } from '../../types/thunk';

import { fetchPost, updatePost } from './thunks';

export const usePost = (postId: number): [boolean, boolean, IPost] => {
  const dispatch = useDispatch<ThunkResult>();
  const { data, error, loading } = useSelector<{ post: IPostState }, IPostState>((state) => state.post);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchPost(postId));
  }, [postId]);

  return [loading, error, data];
};

export const usePostApi = (): {
  updatePost: (post: { postId: number; title: string; text: string }) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    updatePost: (post): void => {
      dispatch(updatePost(post));
    },
  };
};
