import { createAsyncThunk } from '@reduxjs/toolkit';

import { ThunkExtras } from '../../types/store';
import { clearUserState, setUser } from './actions';
import { UserPayload } from './types';

export const signIn = createAsyncThunk<void, UserPayload, { extra: ThunkExtras }>(
  'user/signIn',
  async ({ email, password }, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      const { data } = await services.user.signIn({ email, password });

      dispatch(setUser(data));
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const authorization = createAsyncThunk<void, void, { extra: ThunkExtras }>(
  'user/authorization',
  async (_, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      const { data } = await services.user.authorization();
      if (typeof data === 'object') {
        dispatch(setUser(data));
      }
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const signUp = createAsyncThunk<void, UserPayload, { extra: ThunkExtras }>(
  'user/signUp',
  async ({ email, password }, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      const { data } = await services.user.signUp({ email, password });

      dispatch(setUser(data));
    } catch (error) {
      logger.error(error, false);
    }
  },
);

export const signOut = createAsyncThunk<void, void, { extra: ThunkExtras }>(
  'user/signOut',
  async (_, { dispatch, extra }): Promise<void> => {
    const { logger, services } = extra;
    try {
      await services.user.signOut();

      dispatch(clearUserState());
    } catch (error) {
      logger.error(error, false);
    }
  },
);
