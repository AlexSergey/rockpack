import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: path.resolve(__dirname, '../.env.example')
});

export default {
  logLevel: 'info',
  shutdownTimeout: 1000,
  http: {
    port: process.env.PORT
  }
};
