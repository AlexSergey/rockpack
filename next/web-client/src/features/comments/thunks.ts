import { createAsyncThunk } from '@reduxjs/toolkit';

import { IComment } from '../../types/comments';
import { IThunkExtras } from '../../types/store';
import { IUser } from '../../types/user';
import { decreaseComment, increaseComment } from '../common/actions';
import {
  commentCreated,
  commentDeleted,
  requestComments,
  requestCommentsError,
  requestCommentsSuccess,
} from './actions';
import { ICommentRes, ICommentsRes } from './service';

export const fetchComments = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'comments/fetch',
  async (postId, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      dispatch(requestComments());
      const { data }: ICommentsRes = await services.comments.fetchComments(postId);
      dispatch(requestCommentsSuccess(data));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestCommentsError());
    }
  },
);

export const createComment = createAsyncThunk<
  void,
  { postId: number; text: string; user: IUser },
  { extra: IThunkExtras }
>('comments/create', async ({ postId, text, user }, { dispatch, extra }): Promise<void> => {
  const { logger, services } = extra;
  try {
    dispatch(requestComments());
    const { data }: ICommentRes = await services.comments.createComment(postId, text);

    const comment: IComment = {
      createdAt: new Date().toString(),
      id: data.id,
      text,
      User: {
        email: user.email,
        id: user.id,
        Role: {
          role: user.Role.role,
        },
        Statistic: { ...user.Statistic },
      },
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
    const { logger, services } = extra;
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
