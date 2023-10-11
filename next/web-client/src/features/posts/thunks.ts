import { createAsyncThunk } from '@reduxjs/toolkit';

import { IRootState, IThunkExtras } from '../../types/store';
import { decreaseComment, decreasePost, increasePost } from '../common/actions';
import {
  paginationSetCount,
  paginationSetCurrent,
  postDeleted,
  requestPosts,
  requestPostsError,
  requestPostsSuccess,
} from './actions';
import { PostsRes } from './service';
import { IDeletePostPayload, IPostsPayload } from './types';

export const fetchPosts = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'posts/fetch',
  async (page, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      dispatch(requestPosts());
      const {
        data: { count, posts },
      }: PostsRes = await services.posts.fetchPosts(page);
      dispatch(paginationSetCount(count));
      dispatch(requestPostsSuccess(posts));
    } catch (error) {
      logger.error(error, false);
      dispatch(requestPostsError());
    }
  },
);

export const setPage = createAsyncThunk<void, number, { extra: IThunkExtras }>(
  'posts/setPage',
  async (page, { dispatch, extra, getState }): Promise<void> => {
    const { history, logger } = extra;
    const state = getState() as IRootState;
    const { currentLanguage } = state.localization;
    try {
      dispatch(paginationSetCurrent(page));
      history.push(`/${currentLanguage}/?page=${page}`);
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const createPost = createAsyncThunk<void, IPostsPayload, { extra: IThunkExtras }>(
  'posts/createPost',
  async ({ page, postData }, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      await services.posts.createPost(postData);

      const {
        data: { count, posts },
      }: PostsRes = await services.posts.fetchPosts(page);

      dispatch(increasePost());
      dispatch(paginationSetCount(count));
      dispatch(requestPostsSuccess(posts));
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const deletePost = createAsyncThunk<void, IDeletePostPayload, { extra: IThunkExtras }>(
  'posts/deletePost',
  async ({ id, owner }, { dispatch, extra }): Promise<void> => {
    const { logger } = extra;
    try {
      const ownerState = Boolean(owner);
      const deleteComments = [];
      // TODO: uncomment
      /* const {
        data: { deleteComments },
      }: DeletePostRes = await services.posts.deletePost(id); */

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
  },
);
