import { Roles } from '../../types/user';
import { PostsService } from './service';

const simpleuser = 'simple_user@rock.com';
const secondadmin = 'second_admin@rock.com';
export const mockPostsService = (): PostsService => ({
  createPost: () => Promise.resolve(),

  // postId 13 has comments: id 1, 5
  deletePost: () => Promise.resolve({ data: { deleteComments: [1, 5] } }),

  fetchPosts: () =>
    Promise.resolve({
      data: {
        count: 15,
        posts: [
          {
            createdAt: '2020-06-13T03:19:59.000Z',
            id: 13,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592029199206.jpg',
              uri: 'storage/preview-1592029199206.jpg',
            },
            Statistic: {
              comments: 2,
            },
            title: 'The Shawshank Redemption',
            updatedAt: '2020-06-13T03:19:59.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:19:25.000Z',
            id: 12,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592029164815.jpg',
              uri: 'storage/preview-1592029164815.jpg',
            },
            Statistic: {
              comments: 1,
            },
            title: 'The Lord of the Rings - The Return of the King',
            updatedAt: '2020-06-13T03:19:25.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:15:13.000Z',
            id: 11,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028913742.jpg',
              uri: 'storage/preview-1592028913742.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: 'The Lord of the Rings - The Fellowship of the Ring',
            updatedAt: '2020-06-13T03:15:13.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:14:26.000Z',
            id: 10,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028866815.jpg',
              uri: 'storage/preview-1592028866815.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: 'The Godfather - Part II',
            updatedAt: '2020-06-13T03:14:26.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:13:53.000Z',
            id: 9,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028833335.jpg',
              uri: 'storage/preview-1592028833335.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: 'The Godfather',
            updatedAt: '2020-06-13T03:13:53.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:13:15.000Z',
            id: 8,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028795404.jpg',
              uri: 'storage/preview-1592028795404.jpg',
            },
            Statistic: {
              comments: 3,
            },
            title: 'The Dark Knight',
            updatedAt: '2020-06-13T03:13:15.000Z',
            User: {
              email: secondadmin,
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
            createdAt: '2020-06-13T03:12:16.000Z',
            id: 7,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028736434.jpg',
              uri: 'storage/preview-1592028736434.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: "Schindler's List",
            updatedAt: '2020-06-13T03:12:16.000Z',
            User: {
              email: simpleuser,
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
          {
            createdAt: '2020-06-13T03:11:46.000Z',
            id: 6,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028705929.jpg',
              uri: 'storage/preview-1592028705929.jpg',
            },
            Statistic: {
              comments: 2,
            },
            title: 'Pulp Fiction',
            updatedAt: '2020-06-13T03:11:46.000Z',
            User: {
              email: simpleuser,
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
          {
            createdAt: '2020-06-13T03:11:13.000Z',
            id: 5,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028673580.jpg',
              uri: 'storage/preview-1592028673580.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: 'Inception',
            updatedAt: '2020-06-13T03:11:13.000Z',
            User: {
              email: simpleuser,
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
          {
            createdAt: '2020-06-13T03:08:37.000Z',
            id: 4,
            Preview: {
              thumbnail: 'storage/thumb-preview-1592028517207.jpg',
              uri: 'storage/preview-1592028517207.jpg',
            },
            Statistic: {
              comments: 0,
            },
            title: 'test',
            updatedAt: '2020-06-13T03:08:37.000Z',
            User: {
              email: secondadmin,
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
        ],
      },
    }),
});
