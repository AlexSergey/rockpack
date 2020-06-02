import { createReducer } from '@reduxjs/toolkit';
import { setUsers, userDeleted } from './actions';
import { User } from '../../types/User';

export const usersReducer = createReducer<User[]>([], {
  [setUsers.type]: (state, { payload: { users } }) => users,

  [userDeleted.type]: (state, { payload: { id } }) => state.filter(post => post.id !== id),
});
