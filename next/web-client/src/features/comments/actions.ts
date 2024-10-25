import { createAction } from '@reduxjs/toolkit';

import { Comment } from '../../types/comments';

export const requestComments = createAction('Comments are fetching...');

export const requestCommentsSuccess = createAction<Comment[]>('Comments have already fetched');

export const requestCommentsError = createAction('Comments fetched with error');

export const commentCreated = createAction<Comment>('Comment created');

export const commentDeleted = createAction<{ id: number }>('Comment deleted');
