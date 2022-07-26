import { Roles } from '../../types/user';

import { IPostService } from './service';

export const mockPostService = (): IPostService => ({
  fetchPost: () =>
    Promise.resolve({
      data: {
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
        User: {
          Role: {
            role: Roles.admin,
          },
          Statistic: {
            comments: 4,
            posts: 10,
          },

          email: 'second_admin@rock.com',

          id: 2,
          // eslint-disable-next-line camelcase
          role_id: 2,
        },
        createdAt: '2020-06-13T03:19:59.000Z',
        id: 13,
        text: '<p>Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.</p><p><br /></p><p><strong>Director:</strong> Frank Darabont</p><p><strong>Writers:</strong> Stephen King (short story "Rita Hayworth and Shawshank Redemption"), Frank Darabont (screenplay)</p><p><strong>Stars:</strong> Tim Robbins, Morgan Freeman, Bob Gunton | See full cast &amp; crew</p>',
        title: 'The Shawshank Redemption',
        updatedAt: '2020-06-13T03:19:59.000Z',
      },
    }),

  updatePost: () => Promise.resolve(),
});
