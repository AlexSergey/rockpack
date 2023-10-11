import { createAsyncThunk } from '@reduxjs/toolkit';

import { IThunkExtras } from '../../types/store';
import { clearUserState, setUser } from './actions';
import { IUserPayload } from './types';

export const signIn = createAsyncThunk<void, IUserPayload, { extra: IThunkExtras }>(
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

export const authorization = createAsyncThunk<void, void, { extra: IThunkExtras }>(
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

export const signUp = createAsyncThunk<void, IUserPayload, { extra: IThunkExtras }>(
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

export const signOut = createAsyncThunk<void, void, { extra: IThunkExtras }>(
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
