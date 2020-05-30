import { createReducer } from '@reduxjs/toolkit';
import { setUsers } from './actions';
import { User } from '../../types/Users';

export const usersReducer = createReducer<User[]>([], {
  [setUsers.type]: (state, { payload: { users } }) => users
});
