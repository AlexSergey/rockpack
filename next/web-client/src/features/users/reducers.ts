import { createReducer } from '@reduxjs/toolkit';

import { ActionWithPayload } from '../../types/actions';
import { User } from '../../types/user';
import { setUsers, userDeleted } from './actions';
import { SetUsersPayload } from './types';

export const usersReducer = createReducer<User[]>([], (builder) => {
  builder
    .addCase(setUsers.type, (state, { payload: { users } }: ActionWithPayload<SetUsersPayload>) => users)
    .addCase(userDeleted.type, (state, { payload: { id } }: ActionWithPayload<{ id: number }>) => {
      return state.filter((post) => post.id !== id);
    });
});
