import { createAsyncThunk } from '@reduxjs/toolkit';

import { IThunkExtras } from '../../types/store';

import { requestPost, requestPostError, requestPostSuccess, postUpdated } from './actions';
import { PostRes } from './service';

export const fetchPost = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'post/fetchPost',
  async (postId, { dispatch, extra }): Promise<void> => {
    const { services, logger } = extra;
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
  { postId: number; title: string; text: string },
  { extra: IThunkExtras }
>('post/updatePost', async ({ postId, title, text }, { dispatch, extra }): Promise<void> => {
  const { services, logger } = extra;
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
