const path = require('path');
const { isString, isArray } = require('valid-types');
const { distExtension } = require('../constants');

const makeEntry = (conf, root, mode) => {
  if (!isString(conf.src)) {
    console.error('Src must be a string!');
    process.exit(1);
  }

  let entry = {};
  let context = '';
  const entryPoint = path.basename(conf.dist)
    .replace(distExtension, '');

  if (global.ISOMORPHIC) {
    if (isArray(conf.vendor)) {
      entry.vendor = conf.vendor;
    }

    if (
      !conf.__library &&
      mode === 'development' &&
      !conf.nodejs
    ) {
      entry['dev-server'] = require.resolve('webpack-plugin-serve/client');
    }

    entry[entryPoint] = path.resolve(root, conf.src);
    context = path.dirname(entry[entryPoint]);
  } else {
    // eslint-disable-next-line
    if (mode === 'development') {
      if (
        conf.__library ||
        conf.nodejs
      ) {
        entry[entryPoint] = path.resolve(root, conf.src);
      } else {
        entry = [
          require.resolve('webpack-plugin-serve/client'),
          path.resolve(root, conf.src)
        ];
      }
    } else if (mode === 'production') {
      if (isArray(conf.vendor)) {
        entry.vendor = conf.vendor;
      }

      entry[entryPoint] = path.resolve(root, conf.src);
      context = path.dirname(entry[entryPoint]);
    }
  }

  return { entry, context };
};

module.exports = makeEntry;
