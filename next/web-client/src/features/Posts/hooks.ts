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

export const usePostsApi = (): any => {
  const dispatch = useDispatch();

  return {
    createPost: (data: any) => {
      dispatch(createPost(data));
    },
    deletePost: (id: any) => {
      dispatch(deletePost(id));
    }
  };
};
