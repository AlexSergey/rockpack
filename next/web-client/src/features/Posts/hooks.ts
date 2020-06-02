import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, createPost, deletePost } from './actions';
import { PostsState, Post } from '../../types/Posts';

export const usePosts = (): [boolean, boolean, Post[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ posts: PostsState }, PostsState>(state => state.posts);

  useWillMount((resolver) => dispatch(fetchPosts({ resolver })));

  return [loading, error, data];
};

export const usePostsApi = (): {
  createPost: (data: { postData: FormData }) => void;
  deletePost: (id: number) => void;
} => {
  const dispatch = useDispatch();

  return {
    createPost: (data: { postData: FormData }): void => {
      dispatch(createPost(data));
    },
    deletePost: (id: number): void => {
      dispatch(deletePost({ id }));
    }
  };
};
