import { useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, createComment, deleteComment } from './actions';
import { CommentsState, Comment } from '../../types/Comments';
import { User } from '../../types/User';

export const useComments = (postId: number): [boolean, boolean, Comment[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ comments: CommentsState }, CommentsState>(state => state.comments);

  useUssrEffect(() => dispatch(fetchComments({ postId })));

  return [loading, error, data];
};

export const useCommentsApi = (): {
  createComment: (props: { postId: number; text: string; user: User }) => void;
  deleteComment: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch();

  return {
    createComment: ({ postId, text, user }) => {
      dispatch(createComment({ postId, text, user }));
    },

    deleteComment: (id, owner) => {
      dispatch(deleteComment({ id, owner }));
    }
  };
};
