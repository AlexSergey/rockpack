import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { ThunkResult } from '../../types/thunk';
import { User } from '../../types/user';
import { deleteUser, fetchUsers } from './thunks';

export const useUsers = (): User[] => {
  const dispatch = useDispatch<ThunkResult>();
  const users = useSelector<{ users: User[] }, User[]>((state) => state.users);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchUsers());
  }, []);

  return users;
};

interface UseUserApi {
  deleteUser: (id: number) => void;
}

export const useUsersApi = (): UseUserApi => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    deleteUser: (id: number): void => {
      dispatch(deleteUser(id));
    },
  };
};
