import { createAction } from '@reduxjs/toolkit';

import { IUser } from '../../types/user';

export const setUsers = createAction<{ users: IUser[] }>('Set users list');

export const userDeleted = createAction<number>('User deleted');
