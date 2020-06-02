import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { setUser, clearUserState, increaseComment, decreaseComment } from './actions';
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

  [increaseComment.type]: (state) => (
    produce(state, draftState => {
      draftState.Statistic.comments += 1;
    })
  ),

  [decreaseComment.type]: (state) => (
    produce(state, draftState => {
      draftState.Statistic.comments -= 1;
    })
  )
});
