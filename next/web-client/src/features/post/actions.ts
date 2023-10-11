import { createAction } from '@reduxjs/toolkit';

import { IPost } from '../../types/post';

export const requestPost = createAction('Post is fetching...');

export const requestPostSuccess = createAction<IPost>('Post has already fetched');

export const requestPostError = createAction('Post fetched with error');

export const updatePost = createAction<{ post: { postId: number; text: string; title: string } }>(
  'Post is going to be updated',
);

export const postUpdated = createAction<{ text: string; title: string }>('Post updated');
