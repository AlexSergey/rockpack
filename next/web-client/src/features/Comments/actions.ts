import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Comment } from '../../types/Comments';

export const fetchComments = createAction<{ resolver: Resolver; postId: number }>('Comments will fetch');

export const requestComments = createAction('Comments are fetching...');

export const requestCommentsSuccess = createAction<Comment[]>('Comments have already fetched');

export const requestCommentsError = createAction('Comments fetched with error');

export const createComment = createAction<any>('Comments is going to create');

export const commentCreated = createAction<Comment>('Comment created');

export const deleteComment = createAction<any>('Comments is going to delete');

export const commentDeleted = createAction<Comment>('Comment deleted');
