import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Post } from './types';

export const fetchPosts = createAction<{ resolver: Resolver }>('Posts will fetch');

export const requestPosts = createAction('Posts are fetching...');

export const requestPostsSuccess = createAction<Post[]>('Posts have already fetched');

export const requestPostsError = createAction('Posts fetched with error');
