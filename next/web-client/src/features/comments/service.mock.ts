import { Roles } from '../../types/user';
import { ICommentsService } from './service';

export const mockCommentsService = (): ICommentsService => ({
  createComment: () =>
    Promise.resolve({
      data: {
        id: 25,
      },
    }),

  deleteComment: () => Promise.resolve(),

  fetchComments: () =>
    Promise.resolve({
      data: [
        {
          createdAt: '2020-06-15T07:48:45.000Z',
          id: 1,
          text: 'This is the best movie ever!!!',
          User: {
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
        },
        {
          createdAt: '2020-06-15T07:59:41.000Z',
          id: 5,
          text: 'But I think, Green Mile better then The Shawshank Redemption',
          User: {
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
        },
      ],
    }),
});
