import { useEffect, useRef } from 'react';
import { useSsrEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, setPage, createPost, deletePost } from './thunks';
import { PostsState, Post } from '../../types/Posts';

export const usePagination = (): { current: number; count: number } => {
  const { count, current } = useSelector<{ pagination: { current: number; count: number } },
  { current: number; count: number }>(state => state.pagination);

  return {
    count,
    current
  };
};

export const usePosts = (): [boolean, boolean, Post[]] => {
  const init = useRef(true);
  const dispatch = useDispatch();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>(state => state.posts);

  useSsrEffect(() => dispatch(fetchPosts(current)));

  // Pagination changed
  useEffect(() => {
    if (!init.current) {
      dispatch(fetchPosts(current));
    }
    init.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return [loading, error, data];
};

export const usePaginationApi = (): {
  setCurrent: (page: number) => void;
} => {
  const dispatch = useDispatch();

  return {
    setCurrent: (page) => {
      dispatch(setPage(page));
    }
  };
};

export const usePostsApi = (): {
  createPost: (data: { postData: FormData; page: number }) => void;
  deletePost: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch();

  return {
    createPost: (data) => {
      dispatch(createPost(data));
    },
    deletePost: (id, owner) => {
      dispatch(deletePost({ id, owner }));
    }
  };
};
