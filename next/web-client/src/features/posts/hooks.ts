import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { Post, PostsState } from '../../types/posts';
import { ThunkResult } from '../../types/thunk';
import { createPost, deletePost, fetchPosts, setPage } from './thunks';

export const usePagination = (): { count: number; current: number } => {
  const { count, current } = useSelector<
    { pagination: { count: number; current: number } },
    { count: number; current: number }
  >((state) => state.pagination);

  return {
    count,
    current,
  };
};

export const usePosts = (): [boolean, boolean, Post[]] => {
  const dispatch = useDispatch<ThunkResult>();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>((state) => state.posts);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchPosts(current));
  }, [current]);

  return [loading, error, data];
};

export const usePaginationApi = (): {
  setCurrent: (page: number) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    setCurrent: (page): void => {
      dispatch(setPage(page));
    },
  };
};

export const usePostsApi = (): {
  createPost: (data: { page: number; postData: FormData }) => void;
  deletePost: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    createPost: (data): void => {
      dispatch(createPost(data));
    },
    deletePost: (id, owner): void => {
      dispatch(deletePost({ id, owner }));
    },
  };
};
