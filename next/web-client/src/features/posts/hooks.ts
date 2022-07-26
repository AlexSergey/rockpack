import { useSsrEffect } from '@issr/core';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IPostsState, IPost } from '../../types/posts';
import { Dispatcher } from '../../types/store';

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
  const init = useRef(true);
  const dispatch = useDispatch();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: IPostsState }, IPostsState>((state) => state.posts);

  useSsrEffect(() => dispatch(fetchPosts(current)));

  // Pagination changed
  useEffect(() => {
    if (!init.current) {
      dispatch(fetchPosts(current));
    }
    init.current = false;
  }, [current]);

  return [loading, error, data];
};

export const usePaginationApi = (): {
  setCurrent: (page: number) => void;
} => {
  const dispatch = useDispatch<Dispatcher>();

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
  const dispatch = useDispatch();

  return {
    createPost: (data): void => {
      dispatch(createPost(data));
    },
    deletePost: (id, owner): void => {
      dispatch(deletePost({ id, owner }));
    },
  };
};
