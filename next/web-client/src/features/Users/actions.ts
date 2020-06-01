import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { User } from '../../types/Users';

export const fetchUsers = createAction<{ resolver: Resolver }>('Users are fetching...');

export const setUsers = createAction<{ users: User[] }>('Set users list');

export const deleteUser = createAction<any>('User is going to be deleted');

export const userDeleted = createAction<any>('User deleted');
