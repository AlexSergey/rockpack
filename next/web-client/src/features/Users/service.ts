import config from '../../config';
import { User } from '../../types/User';
import { RestInterface } from '../../utils/rest';

type UsersRes = { data: { users: User[] } };

export interface UsersServiceInterface {
  fetchUsers: () => Promise<UsersRes>;

  deleteUser: (id: number) => Promise<void>;
}

export const usersService = (rest: RestInterface): UsersServiceInterface => ({
  fetchUsers: () => rest.get(`${config.api}/v1/users`),

  deleteUser: (id) => rest.delete(`${config.api}/v1/users/${id}`)
});
