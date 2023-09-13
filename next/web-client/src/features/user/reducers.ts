import { createReducer } from '@reduxjs/toolkit';

import { IActionWithPayload } from '../../types/actions';
import { IUser, Roles } from '../../types/user';
import { increaseComment, decreaseComment, increasePost, decreasePost } from '../common/actions';

import { setUser, clearUserState } from './actions';

export const userReducer = createReducer<IUser>(
  {
    Role: {
      role: Roles.unauthorized,
    },
    Statistic: null,
    email: null,
    id: null,
  },
  (builder) => {
    builder
      .addCase(setUser.type, (state, { payload }: IActionWithPayload<IUser>) => ({ ...payload }))
      .addCase(clearUserState.type, () => ({
        Role: {
          role: Roles.unauthorized,
        },
        Statistic: null,
        email: null,
        id: null,
      }))
      .addCase(increaseComment.type, (state) => {
        state.Statistic.comments += 1;
      })
      .addCase(decreaseComment.type, (state) => {
        state.Statistic.comments -= 1;
      })
      .addCase(increasePost.type, (state) => {
        state.Statistic.posts += 1;
      })
      .addCase(decreasePost.type, (state) => {
        state.Statistic.posts -= 1;
      });
  },
);
