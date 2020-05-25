import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Comment } from '../../types/Comments';

export const fetchComments = createAction<{ resolver: Resolver; postId: string }>('Comments will fetch');

export const requestComments = createAction('Comments are fetching...');

export const requestCommentsSuccess = createAction<Comment[]>('Comments have already fetched');

export const requestCommentsError = createAction('Comments fetched with error');
