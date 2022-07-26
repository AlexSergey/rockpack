import { config } from '../../config';
import { IUser } from '../../types/user';
import { IRest } from '../../utils/rest';

type UsersRes = { data: { users: IUser[] } };

export interface IUsersService {
  fetchUsers: () => Promise<UsersRes>;

  deleteUser: (id: number) => Promise<void>;
}

export const usersService = (rest: IRest): IUsersService => ({
  deleteUser: (id) => rest.delete(`${config.api}/v1/users/${id}`),

  fetchUsers: () => rest.get(`${config.api}/v1/users`),
});
