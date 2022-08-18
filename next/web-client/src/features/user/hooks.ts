import { useSsrEffect, useRegisterEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '../../types/store';
import { IUser, UserStatistic, Roles } from '../../types/user';

import { signIn, signOut, signUp, authorization } from './thunks';

export const useUser = (): IUser => useSelector<IRootState, IUser>((state) => state.user);

export const useRole = (): Roles => useSelector<IRootState, Roles>((state) => state.user.Role.role);

export const useAuthorization = (): void => {
  const dispatch = useDispatch();
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, authorization());
  }, []);
};

export const useUserStatistic = (): UserStatistic => {
  const { comments, posts } = useSelector<IRootState, UserStatistic>((state) => state.user.Statistic);

  return {
    comments,
    posts,
  };
};

export const useUserApi = (): {
  signin: (props: { email: string; password: string }) => void;
  signup: (props: { email: string; password: string }) => void;
  signout: () => void;
} => {
  const dispatch = useDispatch();

  return {
    signin: (user): void => {
      dispatch(signIn(user));
    },
    signout: (): void => {
      dispatch(signOut());
    },
    signup: (user): void => {
      dispatch(signUp(user));
    },
  };
};
