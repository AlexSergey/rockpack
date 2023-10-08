import { useSsrEffect, useRegisterEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';

import { IPostsState, IPost } from '../../types/posts';
import { ThunkResult } from '../../types/thunk';

import { fetchPosts, setPage, createPost, deletePost } from './thunks';

export const usePagination = (): { current: number; count: number } => {
  const { count, current } = useSelector<
    { pagination: { current: number; count: number } },
    { current: number; count: number }
  >((state) => state.pagination);

  return {
    count,
    current,
  };
};

export const usePosts = (): [boolean, boolean, IPost[]] => {
  const dispatch = useDispatch<ThunkResult>();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: IPostsState }, IPostsState>((state) => state.posts);
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
  createPost: (data: { postData: FormData; page: number }) => void;
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
