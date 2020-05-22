import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: path.resolve(process.env.ROOT_DIRNAME, './.env.example'),
  allowEmptyValues: true
});

export enum Roles {
  user = 'user',
  admin = 'admin'
}

export default {
  roles: {
    [Roles.user]: Roles.user,
    [Roles.admin]: Roles.admin,
  },
  jwtExpiresIn: '7d',
  logLevel: 'info',
  postsLimit: 20,
  storage: 'storage',
  files: {
    maxSize: 3 * 1024 * 1024,
    preview: 1,
    photos: 10,
    thumbnail: {
      preview: {
        width: 700
      },
      photos: 200
    },
    thumbnailPrefix: 'thumb',
    types: ['image/jpeg', 'image/jpg', 'image/png']
  },
  workers: {
    removeImages: `${process.env.ROOT_DIRNAME}/workers/removeImages.js`
  },
  shutdownTimeout: 1000,
  http: {
    host: process.env.HOST,
    port: process.env.PORT
  }
};
