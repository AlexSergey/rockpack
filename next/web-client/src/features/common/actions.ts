import { createAction } from '@reduxjs/toolkit';

export const increaseComment = createAction('Comment was added');
export const decreaseComment = createAction('Comment was removed');
export const increasePost = createAction('Post was added');
export const decreasePost = createAction('Post was removed');
