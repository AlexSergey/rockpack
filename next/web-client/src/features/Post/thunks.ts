import { requestPost, requestPostError, requestPostSuccess, postUpdated } from './actions';
import { PostRes } from './service';
import { ThunkResult } from '../../types/thunk';

export const fetchPost = (postId: number): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    dispatch(requestPost());
    const { data }: PostRes = await services.post.fetchPost(postId);
    dispatch(requestPostSuccess(data));
  } catch (error) {
    logger.error(error, false);
    dispatch(requestPostError());
  }
};

export const updatePost = ({
  postId,
  title,
  text }: {
  postId: number;
  title: string;
  text: string
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    dispatch(requestPost());
    await services.post.updatePost(postId, {
      title,
      text
    });
    dispatch(postUpdated({
      title,
      text
    }));
  } catch (error) {
    logger.error(error, false);
    dispatch(requestPostError());
  }
};
