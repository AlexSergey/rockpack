import { createAsyncThunk } from '@reduxjs/toolkit';

import { IThunkExtras } from '../../types/store';
import { postUpdated, requestPost, requestPostError, requestPostSuccess } from './actions';
import { IPostRes } from './service';

export const fetchPost = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'post/fetchPost',
  async (postId, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      dispatch(requestPost());
      const { data }: IPostRes = await services.post.fetchPost(postId);
      dispatch(requestPostSuccess(data));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestPostError());
    }
  },
);

export const updatePost = createAsyncThunk<
  void,
  { postId: number; text: string; title: string },
  { extra: IThunkExtras }
>('post/updatePost', async ({ postId, text, title }, { dispatch, extra }): Promise<void> => {
  const { logger, services } = extra;
  try {
    dispatch(requestPost());
    await services.post.updatePost(postId, {
      text,
      title,
    });
    dispatch(
      postUpdated({
        text,
        title,
      }),
    );
  } catch (error) {
    logger.error(error, false);
    dispatch(requestPostError());
  }
});
