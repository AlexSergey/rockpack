const dotenv = require('dotenv');
const { existsSync } = require('node:fs');
const path = require('node:path');

if (existsSync(path.resolve(__dirname, './.env.test'))) {
  dotenv.config({ path: './.env.test' });
}
