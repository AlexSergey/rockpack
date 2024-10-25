import { createAction } from '@reduxjs/toolkit';

import { User } from '../../types/user';

export const setUser = createAction<User>('Set user');
export const clearUserState = createAction('Clear user after signout');
