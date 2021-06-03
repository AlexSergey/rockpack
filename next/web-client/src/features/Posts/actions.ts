import { createAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Posts';

export const requestPosts = createAction('Posts are fetching...');

export const requestPostsSuccess = createAction<Post[]>('Posts have already fetched');

export const requestPostsError = createAction('Posts fetched with error');

export const postDeleted = createAction<{ id: number }>('Post deleted');

export const paginationSetCurrent = createAction<number>('Set pagination current');

export const paginationSetCount = createAction<number>('Set pagination count');
