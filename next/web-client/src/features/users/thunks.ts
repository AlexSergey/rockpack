import { createAsyncThunk } from '@reduxjs/toolkit';

import { ThunkExtras } from '../../types/store';
import { setUsers, userDeleted } from './actions';

export const fetchUsers = createAsyncThunk<void, void, { extra: ThunkExtras }>(
  'users/fetch',
  async (_, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      const {
        data: { users },
      } = await services.users.fetchUsers();

      dispatch(
        setUsers({
          users,
        }),
      );
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const deleteUser = createAsyncThunk<void, number, { extra: ThunkExtras }>(
  'users/delete',
  async (userId: number, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      await services.users.deleteUser(userId);

      dispatch(userDeleted(userId));
    } catch (error) {
      logger.error(error, false);
    }
  },
);
