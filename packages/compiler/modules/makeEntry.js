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
    !global.ISOMORPHIC &&
    !conf.onlyWatch &&
    !conf.nodejs &&
    mode === 'development'
  ) {
    entry['dev-server-client'] = `${require.resolve('webpack-dev-server/client')}?http://localhost:${conf.port}/`;
    entry['dev-server-hot'] = require.resolve('webpack/hot/dev-server');
  }

  return { entry, context };
};

module.exports = makeEntry;
