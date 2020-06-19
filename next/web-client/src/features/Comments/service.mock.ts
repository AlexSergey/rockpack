import { CommentsServiceInterface } from './service';
import { Roles } from '../../types/User';

export const mockCommentsService = (): CommentsServiceInterface => ({
  fetchComments: () => (
    Promise.resolve({
      data: [
        {
          id: 1,
          text: 'This is the best movie ever!!!',
          createdAt: '2020-06-15T07:48:45.000Z',
          User: {
            id: 2,
            email: 'second_admin@rock.com',
            Statistic: {
              posts: 10,
              comments: 4
            },
            Role: {
              role: Roles.admin
            }
          }
        },
        {
          id: 5,
          text: 'But I think, Green Mile better then The Shawshank Redemption',
          createdAt: '2020-06-15T07:59:41.000Z',
          User: {
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
        }
      ]
    })
  ),

  createComment: () => (
    Promise.resolve({
      data: {
        id: 25
      }
    })
  ),

  deleteComment: () => Promise.resolve()
});
