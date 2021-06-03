import { createReducer } from '@reduxjs/toolkit';
import { setUser, clearUserState } from './actions';
import { increaseComment, decreaseComment, increasePost, decreasePost } from '../__shared/actions';
import { User, Roles } from '../../types/User';

export const userReducer = createReducer<User>({
  id: null,
  email: null,
  Role: {
    role: Roles.unauthorized,
  },
  Statistic: null
}, {
  [setUser.type]: (state, { payload }) => Object.assign({}, payload),

  [clearUserState.type]: () => ({
    id: null,
    email: null,
    Role: {
      role: Roles.unauthorized,
    },
    Statistic: null
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
  }
});
