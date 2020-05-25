import { createReducer } from '@reduxjs/toolkit';
import { setUser, removeUser } from './actions';
import { Roles, AuthState } from '../../types/AuthManager';

export const authReducer = createReducer<AuthState>({
  role: Roles.unauthorized,
  email: null
}, {
  [setUser.type]: (state, { payload }) => ({
    role: payload.role,
    email: payload.email
  }),

  [removeUser.type]: () => ({
    role: Roles.unauthorized,
    email: null
  }),
});
