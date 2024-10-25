import { Roles } from '../../types/user';
import { PostService } from './service';

export const mockPostService = (): PostService => ({
  fetchPost: () =>
    Promise.resolve({
      data: {
        createdAt: '2020-06-13T03:19:59.000Z',
        id: 13,
        Photos: [
          {
            thumbnail: 'storage/thumb-photos-1592029199207.jpg',
            uri: 'storage/photos-1592029199207.jpg',
          },
          {
            thumbnail: 'storage/thumb-photos-1592029199208.jpg',
            uri: 'storage/photos-1592029199208.jpg',
          },
          {
            thumbnail: 'storage/thumb-photos-1592029199209.jpg',
            uri: 'storage/photos-1592029199209.jpg',
          },
          {
            thumbnail: 'storage/thumb-photos-1592029199210.jpg',
            uri: 'storage/photos-1592029199210.jpg',
          },
        ],
        Statistic: {
          comments: 2,
        },
        text: '<p>Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.</p><p><br /></p><p><strong>Director:</strong> Frank Darabont</p><p><strong>Writers:</strong> Stephen King (short story "Rita Hayworth and Shawshank Redemption"), Frank Darabont (screenplay)</p><p><strong>Stars:</strong> Tim Robbins, Morgan Freeman, Bob Gunton | See full cast &amp; crew</p>',
        title: 'The Shawshank Redemption',
        updatedAt: '2020-06-13T03:19:59.000Z',
        User: {
          email: 'second_admin@rock.com',
          id: 2,

          Role: {
            role: Roles.admin,
          },

          role_id: 2,
          Statistic: {
            comments: 4,
            posts: 10,
          },
        },
      },
    }),

  updatePost: () => Promise.resolve(),
});
