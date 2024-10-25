import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { Comment, CommentsState } from '../../types/comments';
import { ThunkResult } from '../../types/thunk';
import { User } from '../../types/user';
import { createComment, deleteComment, fetchComments } from './thunks';

export const useComments = (postId: number): [boolean, boolean, Comment[]] => {
  const dispatch = useDispatch<ThunkResult>();
  const { data, error, loading } = useSelector<{ comments: CommentsState }, CommentsState>((state) => state.comments);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchComments(postId));
  }, [postId]);

  return [loading, error, data];
};

export const useCommentsApi = (): {
  createComment: (props: { postId: number; text: string; user: User }) => void;
  deleteComment: (id: number, owner?: boolean) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    createComment: ({ postId, text, user }): void => {
      dispatch(createComment({ postId, text, user }));
    },

    deleteComment: (id, owner): void => {
      dispatch(deleteComment({ id, owner }));
    },
  };
};
