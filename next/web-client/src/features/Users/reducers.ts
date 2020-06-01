import { createReducer } from '@reduxjs/toolkit';
import { setUsers, userDeleted } from './actions';
import { User } from '../../types/Users';

export const usersReducer = createReducer<User[]>([], {
  [setUsers.type]: (state, { payload: { users } }) => users,

  [userDeleted.type]: (state, { payload }) => state.filter(post => post.id !== payload),
});
