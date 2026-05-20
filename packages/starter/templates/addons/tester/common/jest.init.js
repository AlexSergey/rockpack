import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

if (existsSync(resolve(__dirname, './.env.test'))) {
  dotenv.config({ path: './.env.test' });
}
