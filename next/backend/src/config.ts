import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: path.resolve(process.env.ROOT_DIRNAME, './.env.example'),
  allowEmptyValues: true
});

export default {
  logLevel: 'info',
  shutdownTimeout: 1000,
  http: {
    port: process.env.PORT
  }
};
