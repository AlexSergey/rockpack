import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Post } from '../../types/PostDetails';

export const fetchPost = createAction<{ resolver: Resolver; postId: number }>('Post will fetch');

export const requestPost = createAction('Post is fetching...');

export const requestPostSuccess = createAction<Post>('Post has already fetched');

export const requestPostError = createAction('Post fetched with error');

export const increaseComment = createAction('Comment was added');

export const updatePost = createAction<any>('Post is going to be updated');

export const postUpdated = createAction<any>('Post updated');
