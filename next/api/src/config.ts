import path from 'path';
import dotenvSafe from 'dotenv-safe';
import yargs from 'yargs';

const { argv } = yargs(process.argv);

dotenvSafe.config({
  path: argv.env === 'test' ?
    path.resolve('./.env.test') :
    path.resolve('./.env'),
  example: path.resolve(path.resolve('./'), './.env.example'),
  allowEmptyValues: true
});

// eslint-disable-next-line no-shadow
export enum Roles {
  user = 'user',
  admin = 'admin'
}

export const config = {
  roles: {
    [Roles.user]: Roles.user,
    [Roles.admin]: Roles.admin,
  },
  jwtExpiresIn: '7d',
  logLevel: 'info',
  postsLimit: 10,
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
    removeImages: `${path.resolve('./')}/workers/removeImages.js`
  },
  shutdownTimeout: 1000,
  http: {
    host: process.env.HOST,
    port: process.env.PORT
  }
};
