const { existsSync } = require('node:fs');
const path = require('node:path');

require('@testing-library/jest-dom/extend-expect');
const dotenv = require('dotenv');

if (existsSync(path.resolve(__dirname, './.env.test'))) {
  dotenv.config({ path: './.env.test' });
}
