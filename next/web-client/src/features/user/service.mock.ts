import { Roles } from '../../types/user';
import { UserService } from './service';

export const mockUserService = (): UserService => ({
  authorization: () =>
    Promise.resolve({
      data: {
        email: 'admin@rock.com',
        id: 1,

        Role: {
          role: Roles.admin,
        },

        role_id: 2,
        Statistic: {
          comments: 0,
          posts: 0,
        },
      },
    }),

  signIn: () =>
    Promise.resolve({
      data: {
        email: 'admin@rock.com',
        id: 1,

        Role: {
          role: Roles.admin,
        },

        role_id: 2,
        Statistic: {
          comments: 0,
          posts: 0,
        },
      },
    }),

  signOut: () => Promise.resolve(),

  signUp: (user) =>
    Promise.resolve({
      data: {
        email: user.email,
        id: 10,
        Role: {
          role: Roles.user,
        },
        role_id: 2,
        Statistic: {
          comments: 0,
          posts: 0,
        },
      },
    }),
});
