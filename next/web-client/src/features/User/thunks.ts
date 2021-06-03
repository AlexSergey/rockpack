import { setUser, clearUserState } from './actions';
import { ThunkResult } from '../../types/thunk';

export const signIn = ({
  email,
  password
}: {
  email: string;
  password: string;
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const { data } = await services.user.signIn({ email, password });

    dispatch(setUser(data));
  } catch (error) {
    logger.error(error, false);
  }
};

export const authorization = (): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const { data } = await services.user.authorization();
    if (typeof data === 'object') {
      dispatch(setUser(data));
    }
  } catch (error) {
    logger.error(error, false);
  }
};

export const signUp = ({
  email,
  password
}: {
  email: string;
  password: string;
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const { data } = await services.user.signUp({ email, password });

    dispatch(setUser(data));
  } catch (error) {
    logger.error(error, false);
  }
};

export const signOut = (): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    await services.user.signOut();

    dispatch(clearUserState());
  } catch (error) {
    logger.error(error, false);
  }
};
