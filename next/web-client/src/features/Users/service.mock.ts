import { UsersServiceInterface } from './service';
import { Roles } from '../../types/User';

export const mockUsersService = (): UsersServiceInterface => ({
  fetchUsers: () => (
    Promise.resolve({
      data: {
        users: [
          {
            id: 1,
            email: 'admin@rock.com',
            Statistic: {
              posts: 0,
              comments: 0
            },
            Role: {
              role: Roles.admin
            }
          },
          {
            id: 2,
            email: 'second_admin@rock.com',
            Statistic: {
              posts: 10,
              comments: 4
            },
            Role: {
              role: Roles.admin
            }
          },
          {
            id: 3,
            email: 'simple_user@rock.com',
            Statistic: {
              posts: 3,
              comments: 4
            },
            Role: {
              role: Roles.user
            }
          }
        ]
      }
    })
  ),

  deleteUser: () => Promise.resolve()
});
