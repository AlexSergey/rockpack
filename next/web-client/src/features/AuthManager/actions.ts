import { createAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/AuthManager';

export const signin = createAction<User>('User is logging');
export const signup = createAction<User>('User is signing');
export const signout = createAction('User is signing out');

export const setUser = createAction<AuthState>('Set user');
export const removeUser = createAction('Remove user');
export const deleteUser = createAction('Delete user');
