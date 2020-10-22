import { useEffect } from 'react';
import { useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, createPost, deletePost, settingPage } from './actions';
import { PostsState, Post } from '../../types/Posts';
import { Languages } from '../../types/Localization';

export const usePagination = (): { current: number; count: number } => {
  const { count, current } = useSelector<{ pagination: { current: number; count: number } },
  { current: number; count: number }>(state => state.pagination);

  return {
    count,
    current
  };
};

export const usePosts = (): [boolean, boolean, Post[]] => {
  const dispatch = useDispatch();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>(state => state.posts);

  useUssrEffect(() => dispatch(fetchPosts({ page: current })));

  // Pagination changed
  useEffect(() => {
    if (current > 1) {
      dispatch(fetchPosts({ page: current }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return [loading, error, data];
};

export const usePaginationApi = (): {
  setCurrent: (currentLanguage: Languages, page: number) => void;
} => {
  const dispatch = useDispatch();

  return {
    setCurrent: (currentLanguage, page) => {
      dispatch(settingPage({ currentLanguage, page }));
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
