import path from 'node:path';

import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  allowEmptyValues: true,
  example: path.resolve(path.resolve('./'), './.env.example'),
  path: process.env.NODE_ENV === 'test' ? path.resolve('./.env.test') : path.resolve('./.env'),
});

// eslint-disable-next-line no-shadow
export enum Roles {
  user = 'user',
  admin = 'admin',
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
    [Roles.user]: Roles.user,
    [Roles.admin]: Roles.admin,
  },
  shutdownTimeout: 1000,
  storage: 'storage',
  workers: {
    removeImages: `${path.resolve('./')}/workers/remove-images.js`,
  },
};
