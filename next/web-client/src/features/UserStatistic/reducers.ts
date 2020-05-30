import { createReducer } from '@reduxjs/toolkit';
import { setUserStatistic } from '../_common/actions';

export const userStatisticReducer = createReducer<any>({
  posts: 0,
  comments: 0
}, {
  [setUserStatistic.type]: (state, { payload }) => ({
    posts: payload.posts,
    comments: payload.comments
  })
});
