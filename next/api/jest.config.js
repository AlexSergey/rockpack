import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  path: path.resolve(__dirname, './.env.test'),
  allowEmptyValues: true
});
