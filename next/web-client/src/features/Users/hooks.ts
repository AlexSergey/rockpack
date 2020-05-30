import { useWillMount } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from './actions';
import { User } from '../../types/Users';

export const useUsers = (token: string | undefined): User[] => {
  const dispatch = useDispatch();
  const users = useSelector<{ users: User[] }, User[]>(state => state.users);

  useWillMount((resolver) => dispatch(fetchUsers({ resolver, token })));

  return users;
};
