import { createAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

export const fetchUsers = createAction('Users are fetching...');

export const setUsers = createAction<{ users: User[] }>('Set users list');

export const deleteUser = createAction<{ id: number }>('User is going to be deleted');

export const userDeleted = createAction<{ id: number }>('User deleted');
