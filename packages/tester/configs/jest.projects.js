const path = require('node:path');

const rootFolder = path.resolve(__dirname, '..');

module.exports = {
  projects: [`${rootFolder}/configs/jest.config.js`],
};
