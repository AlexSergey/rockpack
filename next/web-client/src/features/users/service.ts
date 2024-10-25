import { config } from '../../config';
import { User } from '../../types/user';
import { Rest } from '../../utils/rest';

interface UsersRes {
  data: { users: User[] };
}

export interface UsersService {
  deleteUser: (id: number) => Promise<void>;

  fetchUsers: () => Promise<UsersRes>;
}

export const usersService = (rest: Rest): UsersService => ({
  deleteUser: (id) => rest.delete(`${config.api}/v1/users/${id}`),

  fetchUsers: () => rest.get(`${config.api}/v1/users`),
});
