import { UserServiceInterface } from './service';
import { Roles } from '../../types/User';

export const mockUserService = (): UserServiceInterface => ({
  signIn: () => (
    Promise.resolve({
      data: {
        id: 1,
        email: 'admin@rock.com',
        // eslint-disable-next-line camelcase
        role_id: 2,
        Statistic: {
          posts: 0,
          comments: 0
        },
        Role: {
          role: Roles.admin
        }
      }
    })
  ),

  // eslint-disable-next-line sonarjs/no-identical-functions
  authorization: () => (
    Promise.resolve({
      data: {
        id: 1,
        email: 'admin@rock.com',
        // eslint-disable-next-line camelcase
        role_id: 2,
        Statistic: {
          posts: 0,
          comments: 0
        },
        Role: {
          role: Roles.admin
        }
      }
    })
  ),

  signUp: (user) => (
    Promise.resolve({
      data: {
        id: 10,
        email: user.email,
        // eslint-disable-next-line camelcase
        role_id: 2,
        Statistic: {
          posts: 0,
          comments: 0
        },
        Role: {
          role: Roles.user
        }
      }
    })
  ),

  signOut: () => Promise.resolve()
});
