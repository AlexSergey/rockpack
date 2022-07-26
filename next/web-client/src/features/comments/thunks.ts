import { IComment } from '../../types/comments';
import { ThunkResult } from '../../types/thunk';
import { User } from '../../types/user';
import { increaseComment, decreaseComment } from '../common/actions';

import {
  requestCommentsError,
  requestCommentsSuccess,
  requestComments,
  commentCreated,
  commentDeleted,
} from './actions';
import { CommentsRes, CommentRes } from './service';

export const fetchComments =
  (postId: number): ThunkResult =>
  async (dispatch, getState, { services, logger }) => {
    try {
      dispatch(requestComments());
      const { data }: CommentsRes = await services.comments.fetchComments(postId);
      dispatch(requestCommentsSuccess(data));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestCommentsError());
    }
  };

export const createComment =
  ({ text, user, postId }: { text: string; user: User; postId: number }): ThunkResult =>
  async (dispatch, getState, { services, logger }) => {
    try {
      dispatch(requestComments());
      const { data }: CommentRes = await services.comments.createComment(postId, text);

      const comment: IComment = {
        User: {
          Role: {
            role: user.Role.role,
          },
          Statistic: { ...user.Statistic },
          email: user.email,
          id: user.id,
        },
        createdAt: new Date().toString(),
        id: data.id,
        text,
      };

      dispatch(increaseComment());
      dispatch(commentCreated(comment));
    } catch (error) {
      logger.error(error, false);
    }
  };

export const deleteComment =
  ({ id, owner }: { id: number; owner?: boolean }): ThunkResult =>
  async (dispatch, getState, { services, logger }) => {
    try {
      const ownerState = Boolean(owner);
      await services.comments.deleteComment(id);

      dispatch(commentDeleted({ id }));

      if (ownerState) {
        dispatch(decreaseComment());
      }
    } catch (error) {
      logger.error(error, false);
    }
  };
