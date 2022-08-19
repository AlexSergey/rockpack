import { createAction } from '@reduxjs/toolkit';

import { IUser } from '../../types/user';

export const setUser = createAction<IUser>('Set user');
export const clearUserState = createAction('Clear user after signout');
