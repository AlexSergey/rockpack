import { Roles } from '../../types/user';
import { UsersService } from './service';

export const mockUsersService = (): UsersService => ({
  deleteUser: () => Promise.resolve(),

  fetchUsers: () =>
    Promise.resolve({
      data: {
        users: [
          {
            email: 'admin@rock.com',
            id: 1,
            Role: {
              role: Roles.admin,
            },
            Statistic: {
              comments: 0,
              posts: 0,
            },
          },
          {
            email: 'second_admin@rock.com',
            id: 2,
            Role: {
              role: Roles.admin,
            },
            Statistic: {
              comments: 4,
              posts: 10,
            },
          },
          {
            email: 'simple_user@rock.com',
            id: 3,
            Role: {
              role: Roles.user,
            },
            Statistic: {
              comments: 4,
              posts: 3,
            },
          },
        ],
      },
    }),
});
