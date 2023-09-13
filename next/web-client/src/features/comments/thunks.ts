import { createAsyncThunk } from '@reduxjs/toolkit';

import { IComment } from '../../types/comments';
import { IThunkExtras } from '../../types/store';
import { IUser } from '../../types/user';
import { increaseComment, decreaseComment } from '../common/actions';

import {
  requestCommentsError,
  requestCommentsSuccess,
  requestComments,
  commentCreated,
  commentDeleted,
} from './actions';
import { CommentsRes, CommentRes } from './service';

export const fetchComments = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'comments/fetch',
  async (postId, { dispatch, extra }): Promise<void> => {
    const { services, logger } = extra;
    try {
      dispatch(requestComments());
      const { data }: CommentsRes = await services.comments.fetchComments(postId);
      dispatch(requestCommentsSuccess(data));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestCommentsError());
    }
  },
);

export const createComment = createAsyncThunk<
  void,
  { text: string; user: IUser; postId: number },
  { extra: IThunkExtras }
>('comments/create', async ({ text, user, postId }, { dispatch, extra }): Promise<void> => {
  const { services, logger } = extra;
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
});

export const deleteComment = createAsyncThunk<void, { id: number; owner?: boolean }, { extra: IThunkExtras }>(
  'comments/delete',
  async ({ id, owner }, { dispatch, extra }): Promise<void> => {
    const { services, logger } = extra;
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
  },
);
