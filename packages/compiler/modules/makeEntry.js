const path = require('path');
const { isString, isArray } = require('valid-types');
const { distExtension } = require('../constants');

const makeEntry = (conf, root, mode) => {
  if (!isString(conf.src)) {
    console.error('Src must be a string!');
    process.exit(1);
  }

  const entry = {};

  if (isArray(conf.vendor)) {
    entry.vendor = conf.vendor;
  }
  const entryPoint = path.basename(conf.dist)
    .replace(distExtension, '');

  entry[entryPoint] = path.resolve(root, conf.src);
  const context = path.dirname(entry[entryPoint]);

  if (
    mode === 'development' &&
    !conf.nodejs
  ) {
    entry['dev-server'] = require.resolve('webpack-plugin-serve/client');
  }

  return { entry, context };
};

module.exports = makeEntry;
