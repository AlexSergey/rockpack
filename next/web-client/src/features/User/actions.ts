import { createAction } from '@reduxjs/toolkit';
import { Resolver } from '@rockpack/ussr';
import { User } from '../../types/User';

export const signin = createAction<{ email: string; password: string }>('User is logging');
export const signup = createAction<{ email: string; password: string }>('User is signing');
export const signout = createAction('User is signing out');

export const authorization = createAction<{ resolver: Resolver }>('User authorization');

export const setUser = createAction<User>('Set user');
export const clearUserState = createAction('Remove user');

export const increaseComment = createAction('Comment was added');

export const decreaseComment = createAction('Comment was removed');
