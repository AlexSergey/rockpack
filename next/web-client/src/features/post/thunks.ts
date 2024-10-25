import { createAsyncThunk } from '@reduxjs/toolkit';

import { ThunkExtras } from '../../types/store';
import { postUpdated, requestPost, requestPostError, requestPostSuccess } from './actions';
import { PostRes } from './service';

export const fetchPost = createAsyncThunk<void, number, { extra: ThunkExtras }>(
  'post/fetchPost',
  async (postId, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      dispatch(requestPost());
      const { data }: PostRes = await services.post.fetchPost(postId);
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
  { extra: ThunkExtras }
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
