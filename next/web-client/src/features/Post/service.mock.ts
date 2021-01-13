import { PostServiceInterface } from './service';
import { Roles } from '../../types/User';

export const mockPostService = (): PostServiceInterface => ({
  fetchPost: () => (
    Promise.resolve({
      data: {
        id: 13,
        title: 'The Shawshank Redemption',
        text: '<p>Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.</p><p><br /></p><p><strong>Director:</strong> Frank Darabont</p><p><strong>Writers:</strong> Stephen King (short story "Rita Hayworth and Shawshank Redemption"), Frank Darabont (screenplay)</p><p><strong>Stars:</strong> Tim Robbins, Morgan Freeman, Bob Gunton | See full cast &amp; crew</p>',
        createdAt: '2020-06-13T03:19:59.000Z',
        updatedAt: '2020-06-13T03:19:59.000Z',
        User: {
          id: 2,
          email: 'second_admin@rock.com',
          // eslint-disable-next-line camelcase
          role_id: 2,
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
        Photos: [
          {
            uri: 'storage/photos-1592029199207.jpg',
            thumbnail: 'storage/thumb-photos-1592029199207.jpg'
          },
          {
            uri: 'storage/photos-1592029199208.jpg',
            thumbnail: 'storage/thumb-photos-1592029199208.jpg'
          },
          {
            uri: 'storage/photos-1592029199209.jpg',
            thumbnail: 'storage/thumb-photos-1592029199209.jpg'
          },
          {
            uri: 'storage/photos-1592029199210.jpg',
            thumbnail: 'storage/thumb-photos-1592029199210.jpg'
          }
        ]
      }
    })
  ),

  updatePost: () => Promise.resolve()
});
