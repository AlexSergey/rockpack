import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Posts';

export const fetchPosts = createAction<{ resolver: Resolver }>('Posts will fetch');

export const requestPosts = createAction('Posts are fetching...');

export const requestPostsSuccess = createAction<Post[]>('Posts have already fetched');

export const requestPostsError = createAction('Posts fetched with error');

export const createPost = createAction<any>('Post is going to create');

export const deletePost = createAction<any>('Post is going to delete');

export const postDeleted = createAction<any>('Post deleted');
