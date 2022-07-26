const { existsSync } = require('node:fs');
const path = require('node:path');

const pathToTsConf = (root, mode, debug) => {
  let tsConfig = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');

    if (debug && existsSync(path.resolve(root, './tsconfig.debug.js'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.js');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');

    if (debug && existsSync(path.resolve(root, './tsconfig.debug.json'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.json');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  return tsConfig;
};

module.exports = pathToTsConf;
