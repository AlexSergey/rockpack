import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { User } from '../../types/Users';

export const fetchUsers = createAction<{ resolver: Resolver; token: string | undefined }>('Users are fetching...');

export const setUsers = createAction<{ users: User[] }>('Set users list');
