import { Roles } from '../../types/user';
import { IUserService } from './service';

export const mockUserService = (): IUserService => ({
  authorization: () =>
    Promise.resolve({
      data: {
        Role: {
          role: Roles.admin,
        },
        Statistic: {
          comments: 0,
          posts: 0,
        },

        email: 'admin@rock.com',

        id: 1,
        role_id: 2,
      },
    }),

  signIn: () =>
    Promise.resolve({
      data: {
        Role: {
          role: Roles.admin,
        },
        Statistic: {
          comments: 0,
          posts: 0,
        },

        email: 'admin@rock.com',

        id: 1,
        role_id: 2,
      },
    }),

  signOut: () => Promise.resolve(),

  signUp: (user) =>
    Promise.resolve({
      data: {
        Role: {
          role: Roles.user,
        },
        Statistic: {
          comments: 0,
          posts: 0,
        },
        email: user.email,
        id: 10,
        role_id: 2,
      },
    }),
});
