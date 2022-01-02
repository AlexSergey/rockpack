import {
  requestPosts,
  requestPostsError,
  requestPostsSuccess,
  postDeleted,
  paginationSetCount,
  paginationSetCurrent
} from './actions';
import { increasePost, decreasePost, decreaseComment } from '../__shared/actions';
import { PostsRes, DeletePostRes } from './service';
import { ThunkResult } from '../../types/thunk';

export const fetchPosts = (page: number): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    dispatch(requestPosts());
    const { data: { posts, count } }: PostsRes = await services.posts.fetchPosts(page);
    dispatch(paginationSetCount(count));
    dispatch(requestPostsSuccess(posts));
  } catch (error) {
    logger.error(error, false);
    dispatch(requestPostsError());
  }
};

export const setPage = (page: number): ThunkResult<string | false> => async (
  dispatch,
  getState,
  { logger }
) => {
  const { currentLanguage } = getState().localization;
  try {
    dispatch(paginationSetCurrent(page));
    return currentLanguage;
  } catch (error) {
    logger.error(error, false);
  }
  return false;
};

export const createPost = ({
  postData,
  page
}: {
  postData: FormData;
  page: number;
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    await services.posts.createPost(postData);

    const { data: { posts, count } }: PostsRes = await services.posts.fetchPosts(page);

    dispatch(increasePost());
    dispatch(paginationSetCount(count));
    dispatch(requestPostsSuccess(posts));
  } catch (error) {
    logger.error(error, false);
  }
};

export const deletePost = ({
  id,
  owner
}: {
  id: number;
  owner: boolean;
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const ownerState = Boolean(owner);
    const { data: { deleteComments } }: DeletePostRes = await services.posts.deletePost(id);

    if (Array.isArray(deleteComments) && deleteComments.length > 0) {
      for (let i = 0, l = deleteComments.length; i < l; i++) {
        dispatch(decreaseComment());
      }
    }

    if (ownerState) {
      dispatch(decreasePost());
    }

    dispatch(postDeleted({ id }));
  } catch (error) {
    logger.error(error, false);
    dispatch(requestPostsError());
  }
};
