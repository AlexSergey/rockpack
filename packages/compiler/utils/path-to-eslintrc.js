const { existsSync } = require('node:fs');
const path = require('node:path');

const pathToEslintrc = (root, mode) => {
  let eslintRc = false;

  if (existsSync(path.resolve(root, '.eslintrc.js'))) {
    eslintRc = path.resolve(root, '.eslintrc.js');
  }

  if (existsSync(path.resolve(root, './.eslintrc.development.js')) && mode === 'development') {
    eslintRc = path.resolve(root, './.eslintrc.development.js');
  }

  if (existsSync(path.resolve(root, './.eslintrc.production.js')) && mode === 'production') {
    eslintRc = path.resolve(root, './.eslintrc.production.js');
  }

  if (existsSync(path.resolve(root, 'eslintrc.js'))) {
    eslintRc = path.resolve(root, 'eslintrc.js');
  }

  if (existsSync(path.resolve(root, './eslintrc.development.js')) && mode === 'development') {
    eslintRc = path.resolve(root, './eslintrc.development.js');
  }

  if (existsSync(path.resolve(root, './eslintrc.production.js')) && mode === 'production') {
    eslintRc = path.resolve(root, './eslintrc.production.js');
  }

  return eslintRc;
};

module.exports = pathToEslintrc;
