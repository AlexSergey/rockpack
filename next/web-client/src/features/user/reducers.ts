import { createReducer } from '@reduxjs/toolkit';

import { ActionWithPayload } from '../../types/actions';
import { Roles, User } from '../../types/user';
import { decreaseComment, decreasePost, increaseComment, increasePost } from '../common/actions';
import { clearUserState, setUser } from './actions';

export const userReducer = createReducer<User>(
  {
    email: null,
    id: null,
    Role: {
      role: Roles.unauthorized,
    },
    Statistic: null,
  },
  (builder) => {
    builder
      .addCase(setUser.type, (state, { payload }: ActionWithPayload<User>) => ({ ...payload }))
      .addCase(clearUserState.type, () => ({
        email: null,
        id: null,
        Role: {
          role: Roles.unauthorized,
        },
        Statistic: null,
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
