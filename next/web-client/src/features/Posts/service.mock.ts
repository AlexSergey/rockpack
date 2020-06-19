import { PostsServiceInterface } from './service';
import { Roles } from '../../types/User';

export const mockPostsService = (): PostsServiceInterface => ({
  fetchPosts: () => (
    Promise.resolve({
      data: {
        posts: [
          {
            id: 13,
            title: 'The Shawshank Redemption',
            createdAt: '2020-06-13T03:19:59.000Z',
            updatedAt: '2020-06-13T03:19:59.000Z',
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
            },
            Statistic: {
              comments: 2
            },
            Preview: {
              uri: 'storage/preview-1592029199206.jpg',
              thumbnail: 'storage/thumb-preview-1592029199206.jpg'
            }
          },
          {
            id: 12,
            title: 'The Lord of the Rings - The Return of the King',
            createdAt: '2020-06-13T03:19:25.000Z',
            updatedAt: '2020-06-13T03:19:25.000Z',
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
            },
            Statistic: {
              comments: 1
            },
            Preview: {
              uri: 'storage/preview-1592029164815.jpg',
              thumbnail: 'storage/thumb-preview-1592029164815.jpg'
            }
          },
          {
            id: 11,
            title: 'The Lord of the Rings - The Fellowship of the Ring',
            createdAt: '2020-06-13T03:15:13.000Z',
            updatedAt: '2020-06-13T03:15:13.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028913742.jpg',
              thumbnail: 'storage/thumb-preview-1592028913742.jpg'
            }
          },
          {
            id: 10,
            title: 'The Godfather - Part II',
            createdAt: '2020-06-13T03:14:26.000Z',
            updatedAt: '2020-06-13T03:14:26.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028866815.jpg',
              thumbnail: 'storage/thumb-preview-1592028866815.jpg'
            }
          },
          {
            id: 9,
            title: 'The Godfather',
            createdAt: '2020-06-13T03:13:53.000Z',
            updatedAt: '2020-06-13T03:13:53.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028833335.jpg',
              thumbnail: 'storage/thumb-preview-1592028833335.jpg'
            }
          },
          {
            id: 8,
            title: 'The Dark Knight',
            createdAt: '2020-06-13T03:13:15.000Z',
            updatedAt: '2020-06-13T03:13:15.000Z',
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
            },
            Statistic: {
              comments: 3
            },
            Preview: {
              uri: 'storage/preview-1592028795404.jpg',
              thumbnail: 'storage/thumb-preview-1592028795404.jpg'
            }
          },
          {
            id: 7,
            title: "Schindler's List",
            createdAt: '2020-06-13T03:12:16.000Z',
            updatedAt: '2020-06-13T03:12:16.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028736434.jpg',
              thumbnail: 'storage/thumb-preview-1592028736434.jpg'
            }
          },
          {
            id: 6,
            title: 'Pulp Fiction',
            createdAt: '2020-06-13T03:11:46.000Z',
            updatedAt: '2020-06-13T03:11:46.000Z',
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
            },
            Statistic: {
              comments: 2
            },
            Preview: {
              uri: 'storage/preview-1592028705929.jpg',
              thumbnail: 'storage/thumb-preview-1592028705929.jpg'
            }
          },
          {
            id: 5,
            title: 'Inception',
            createdAt: '2020-06-13T03:11:13.000Z',
            updatedAt: '2020-06-13T03:11:13.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028673580.jpg',
              thumbnail: 'storage/thumb-preview-1592028673580.jpg'
            }
          },
          {
            id: 4,
            title: 'test',
            createdAt: '2020-06-13T03:08:37.000Z',
            updatedAt: '2020-06-13T03:08:37.000Z',
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
            },
            Statistic: {
              comments: 0
            },
            Preview: {
              uri: 'storage/preview-1592028517207.jpg',
              thumbnail: 'storage/thumb-preview-1592028517207.jpg'
            }
          }
        ],
        count: 15
      }
    })
  ),

  createPost: () => (
    Promise.resolve()
  ),

  // postId 13 has comments: id 1, 5
  deletePost: () => (
    Promise.resolve(
      { data: { deleteComments: [1, 5] } }
    )
  )
});
