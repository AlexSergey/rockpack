import { ThunkResult } from '../../types/thunk';

import { requestPost, requestPostError, requestPostSuccess, postUpdated } from './actions';
import { PostRes } from './service';

export const fetchPost =
  (postId: number): ThunkResult =>
  async (dispatch, getState, { services, logger }) => {
    try {
      dispatch(requestPost());
      const { data }: PostRes = await services.post.fetchPost(postId);
      dispatch(requestPostSuccess(data));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestPostError());
    }
  };

export const updatePost =
  ({ postId, title, text }: { postId: number; title: string; text: string }): ThunkResult =>
  async (dispatch, getState, { services, logger }) => {
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
  };
