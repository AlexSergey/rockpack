import { createReducer } from '@reduxjs/toolkit';
import { setUser, removeUser } from './actions';
import { Roles, UserState } from '../../types/AuthManager';

export const userReducer = createReducer<UserState>({
  role: Roles.unauthorized,
  email: null
}, {
  [setUser.type]: (state, payload) => ({
    role: payload,
    email: state.email
  }),

  [setUser.type]: (state, payload) => ({
    role: payload,
    email: state.email
  }),

  [removeUser.type]: () => ({
    role: Roles.unauthorized,
    email: null
  }),
});
