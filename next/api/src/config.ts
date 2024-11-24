import dotenvSafe from 'dotenv-safe';
import path from 'node:path';

dotenvSafe.config({
  allowEmptyValues: true,
  example: path.resolve(path.resolve('./'), './.env.example'),
  path: process.env.NODE_ENV === 'test' ? path.resolve('./.env.test') : path.resolve('./.env'),
});

export enum Roles {
  admin = 'admin',
  user = 'user',
}

export const config = {
  files: {
    maxSize: 3 * 1024 * 1024,
    photos: 10,
    preview: 1,
    thumbnail: {
      photos: 200,
      preview: {
        width: 700,
      },
    },
    thumbnailPrefix: 'thumb',
    types: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  http: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwtExpiresIn: '7d',
  logLevel: 'info',
  postsLimit: 10,
  roles: {
    [Roles.admin]: Roles.admin,
    [Roles.user]: Roles.user,
  },
  shutdownTimeout: 1000,
  storage: 'storage',
  workers: {
    removeImages: `${path.resolve('./')}/workers/remove-images.js`,
  },
};
