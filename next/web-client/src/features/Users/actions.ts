import { createAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

export const setUsers = createAction<{ users: User[] }>('Set users list');

export const userDeleted = createAction<number>('User deleted');
