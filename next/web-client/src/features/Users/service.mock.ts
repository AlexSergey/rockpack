import { Roles } from '../../types/user';

import { IUsersService } from './service';

export const mockUsersService = (): IUsersService => ({
  deleteUser: () => Promise.resolve(),

  fetchUsers: () =>
    Promise.resolve({
      data: {
        users: [
          {
            Role: {
              role: Roles.admin,
            },
            Statistic: {
              comments: 0,
              posts: 0,
            },
            email: 'admin@rock.com',
            id: 1,
          },
          {
            Role: {
              role: Roles.admin,
            },
            Statistic: {
              comments: 4,
              posts: 10,
            },
            email: 'second_admin@rock.com',
            id: 2,
          },
          {
            Role: {
              role: Roles.user,
            },
            Statistic: {
              comments: 4,
              posts: 3,
            },
            email: 'simple_user@rock.com',
            id: 3,
          },
        ],
      },
    }),
});
