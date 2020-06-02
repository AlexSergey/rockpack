import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Posts';

export const fetchPosts = createAction<{ resolver: Resolver }>('Posts will fetch');

export const requestPosts = createAction('Posts are fetching...');

export const requestPostsSuccess = createAction<Post[]>('Posts have already fetched');

export const requestPostsError = createAction('Posts fetched with error');

export const createPost = createAction<{ postData: FormData }>('Post is going to be created');

export const deletePost = createAction<{ id: number }>('Post is going to be deleted');

export const postDeleted = createAction<{ id: number }>('Post deleted');
