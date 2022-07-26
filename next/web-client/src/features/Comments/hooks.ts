import { useSsrEffect } from '@issr/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICommentsState, IComment } from '../../types/comments';
import { IUser } from '../../types/user';

import { fetchComments, createComment, deleteComment } from './thunks';

export const useComments = (postId: number): [boolean, boolean, IComment[]] => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector<{ comments: ICommentsState }, ICommentsState>((state) => state.comments);

  useSsrEffect(() => dispatch(fetchComments(postId)));

  return [loading, error, data];
};

export const useCommentsApi = (): {
  createComment: (props: { postId: number; text: string; user: IUser }) => void;
  deleteComment: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch();

  return {
    createComment: ({ postId, text, user }): void => {
      dispatch(createComment({ postId, text, user }));
    },

    deleteComment: (id, owner): void => {
      dispatch(deleteComment({ id, owner }));
    },
  };
};
