import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../types/store';
import { ThunkResult } from '../../types/thunk';
import { Roles, User, UserStatistic } from '../../types/user';
import { authorization, signIn, signOut, signUp } from './thunks';
import { UserPayload } from './types';

export const useUser = (): User => useSelector<RootState, User>((state) => state.user);

export const useRole = (): Roles => useSelector<RootState, Roles>((state) => state.user.Role.role);

export const useAuthorization = (): void => {
  const dispatch = useDispatch<ThunkResult>();
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, authorization());
  }, []);
};

export const useUserStatistic = (): UserStatistic => {
  const { comments, posts } = useSelector<RootState, UserStatistic>((state) => state.user.Statistic);

  return {
    comments,
    posts,
  };
};

export const useUserApi = (): {
  signin: (props: UserPayload) => void;
  signout: () => void;
  signup: (props: UserPayload) => void;
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
