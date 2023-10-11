import { useRegisterEffect, useSsrEffect } from '@issr/core';
import { useDispatch, useSelector } from 'react-redux';

import { ThunkResult } from '../../types/thunk';
import { IUser } from '../../types/user';
import { deleteUser, fetchUsers } from './thunks';

export const useUsers = (): IUser[] => {
  const dispatch = useDispatch<ThunkResult>();
  const users = useSelector<{ users: IUser[] }, IUser[]>((state) => state.users);
  const registerEffect = useRegisterEffect();

  useSsrEffect(() => {
    registerEffect(dispatch, fetchUsers());
  }, []);

  return users;
};

interface IUseUserApi {
  deleteUser: (id: number) => void;
}

export const useUsersApi = (): IUseUserApi => {
  const dispatch = useDispatch<ThunkResult>();

  return {
    deleteUser: (id: number): void => {
      dispatch(deleteUser(id));
    },
  };
};
