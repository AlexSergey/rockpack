import { useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from './actions';
import { User } from '../../types/User';

export const useUsers = (): User[] => {
  const dispatch = useDispatch();
  const users = useSelector<{ users: User[] }, User[]>(state => state.users);

  useUssrEffect(() => dispatch(fetchUsers()));

  return users;
};

interface UseUserApiInterface {
  deleteUser: (id: number) => void;
}

export const useUsersApi = (): UseUserApiInterface => {
  const dispatch = useDispatch();
  return {
    deleteUser: (id: number): void => {
      dispatch(deleteUser({ id }));
    }
  };
};
