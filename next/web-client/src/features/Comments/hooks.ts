import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, createComment } from './actions';
import { CommentsState, Comment } from '../../types/Comments';

export const useComments = (postId: string): [boolean, boolean, Comment[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ comments: CommentsState }, CommentsState>(state => state.comments);

  useWillMount((resolver) => dispatch(fetchComments({ resolver, postId })));

  return [loading, error, data];
};

export const useCommentsApi = (postId: string): any => {
  const dispatch = useDispatch();


  return {
    createComment: ({ text, user }) => {
      dispatch(createComment({ postId, text, user }));
    }
  };
};
