import { createReducer } from '@reduxjs/toolkit';

import { IUser } from '../../types/user';

import { setUsers, userDeleted } from './actions';

export const usersReducer = createReducer<IUser[]>([], {
  [setUsers.type]: (state, { payload: { users } }) => users,

  [userDeleted.type]: (state, { payload: { id } }) => state.filter((post) => post.id !== id),
});
