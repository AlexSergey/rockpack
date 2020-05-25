import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from './actions';
import { CommentsState, Comment } from '../../types/Comments';

export const useComments = (postId: string): [boolean, boolean, Comment[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ comments: CommentsState }, CommentsState>(state => state.comments);

  useWillMount((resolver) => dispatch(fetchComments({ resolver, postId })));

  return [loading, error, data];
};
