import { createReducer } from '@reduxjs/toolkit';

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
  {
    [setUser.type]: (state, { payload }) => ({ ...payload }),

    [clearUserState.type]: () => ({
      Role: {
        role: Roles.unauthorized,
      },
      Statistic: null,
      email: null,
      id: null,
    }),

    [increaseComment.type]: (state) => {
      state.Statistic.comments += 1;
    },

    [decreaseComment.type]: (state) => {
      state.Statistic.comments -= 1;
    },

    [increasePost.type]: (state) => {
      state.Statistic.posts += 1;
    },

    [decreasePost.type]: (state) => {
      state.Statistic.posts -= 1;
    },
  },
);
