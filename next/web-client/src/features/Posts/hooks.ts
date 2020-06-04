import { useEffect } from 'react';
import { useWillMount, useIsFirstMounting } from '@rockpack/ussr';
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
  const isFirst = useIsFirstMounting();
  const dispatch = useDispatch();
  const { current } = usePagination();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>(state => state.posts);

  useWillMount((resolver) => dispatch(fetchPosts({ resolver, page: current })));

  useEffect(() => {
    if (!isFirst) {
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
    setCurrent: (currentLanguage: Languages, page: number): void => {
      dispatch(settingPage({ currentLanguage, page }));
    }
  };
};

export const usePostsApi = (): {
  createPost: (data: { postData: FormData }) => void;
  deletePost: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch();

  return {
    createPost: (data: { postData: FormData }): void => {
      dispatch(createPost(data));
    },
    deletePost: (id: number, owner?: boolean): void => {
      dispatch(deletePost({ id, owner }));
    }
  };
};
