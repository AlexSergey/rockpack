import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, createComment, deleteComment } from './actions';
import { CommentsState, Comment } from '../../types/Comments';
import { User } from '../../types/User';

export const useComments = (postId: number): [boolean, boolean, Comment[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ comments: CommentsState }, CommentsState>(state => state.comments);

  useWillMount((resolver) => dispatch(fetchComments({ resolver, postId })));

  return [loading, error, data];
};

export const useCommentsApi = (): {
  createComment: (props: { postId: number; text: string; user: User }) => void;
  deleteComment: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch();

  return {
    createComment: ({ postId, text, user }): void => {
      dispatch(createComment({ postId, text, user }));
    },

    deleteComment: (id, owner?: boolean): void => {
      dispatch(deleteComment({ id, owner }));
    }
  };
};
