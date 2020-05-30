import { createAction } from '@reduxjs/toolkit';

export const setUserStatistic = createAction<any>('Set user statistic');

export const increaseComment = createAction('Comment was added');

export const decreaseComment = createAction('Comment was removed');
