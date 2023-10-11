import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '../../types/store';
import { ThunkResult } from '../../types/thunk';
import { IUser, Roles, UserStatistic } from '../../types/user';
import { authorization, signIn, signOut, signUp } from './thunks';
import { IUserPayload } from './types';

export const useUser = (): IUser => useSelector<IRootState, IUser>((state) => state.user);

export const useRole = (): Roles => useSelector<IRootState, Roles>((state) => state.user.Role.role);

export const useAuthorization = (): void => {
  const dispatch = useDispatch<ThunkResult>();
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
  signin: (props: IUserPayload) => void;
  signout: () => void;
  signup: (props: IUserPayload) => void;
} => {
  const dispatch = useDispatch<ThunkResult>();

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
