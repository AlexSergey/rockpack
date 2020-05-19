import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: path.resolve(process.env.ROOT_DIRNAME, './.env.example'),
  allowEmptyValues: true
});

export default {
  jwtExpiresIn: '7d',
  logLevel: 'info',
  postsLimit: 20,
  storage: './storage',
  files: {
    maxSize: 3 * 1024 * 1024,
    preview: 1,
    photos: 10,
    thumbnail: 200,
    thumbnailPrefix: 'thumb',
    types: ['image/jpeg', 'image/jpg', 'image/png']
  },
  shutdownTimeout: 1000,
  http: {
    port: process.env.PORT
  }
};
