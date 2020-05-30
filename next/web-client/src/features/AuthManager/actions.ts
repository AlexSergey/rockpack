import { createAction } from '@reduxjs/toolkit';
import { Resolver } from '@rockpack/ussr';
import { User, AuthState } from '../../types/AuthManager';

export const signin = createAction<User>('User is logging');
export const signup = createAction<User>('User is signing');
export const signout = createAction('User is signing out');

export const authorization = createAction<{ token: string | undefined; resolver: Resolver }>('User authorization');
export const authorize = createAction<any>('User authorize');

export const setUser = createAction<AuthState>('Set user');
export const removeUser = createAction('Remove user');
export const deleteUser = createAction('Delete user');
