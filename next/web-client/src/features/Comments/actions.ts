import { createAction } from '@reduxjs/toolkit';

import { IComment } from '../../types/comments';

export const requestComments = createAction('Comments are fetching...');

export const requestCommentsSuccess = createAction<IComment[]>('Comments have already fetched');

export const requestCommentsError = createAction('Comments fetched with error');

export const commentCreated = createAction<IComment>('Comment created');

export const commentDeleted = createAction<{ id: number }>('Comment deleted');
