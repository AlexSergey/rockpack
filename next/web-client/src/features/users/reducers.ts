import { createReducer } from '@reduxjs/toolkit';

import { IActionWithPayload } from '../../types/actions';
import { IUser } from '../../types/user';
import { setUsers, userDeleted } from './actions';
import { ISetUsersPayload } from './types';

export const usersReducer = createReducer<IUser[]>([], (builder) => {
  builder
    .addCase(setUsers.type, (state, { payload: { users } }: IActionWithPayload<ISetUsersPayload>) => users)
    .addCase(userDeleted.type, (state, { payload: { id } }: IActionWithPayload<{ id: number }>) => {
      return state.filter((post) => post.id !== id);
    });
});
