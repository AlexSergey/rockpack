import { useDispatch, useSelector } from 'react-redux';
import { useSsrEffect } from '@issr/core';
import { signIn, signOut, signUp, authorization } from './thunks';
import { User, UserStatistic, Roles } from '../../types/User';
import { RootState } from '../../types/store';

export const useUser = (): User => (
  useSelector<RootState, User>(
    (state) => state.user
  )
);

export const useRole = (): Roles => (
  useSelector<RootState, Roles>(
    (state) => state.user.Role.role
  )
);

export const useAuthorization = (): void => {
  const dispatch = useDispatch();
  useSsrEffect(() => dispatch(authorization()));
};

export const useUserStatistic = (): UserStatistic => {
  const { comments, posts } = useSelector<RootState, UserStatistic>(state => state.user.Statistic);

  return {
    comments, posts
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
    signup: (user): void => {
      dispatch(signUp(user));
    },
    signout: (): void => {
      dispatch(signOut());
    }
  };
};
