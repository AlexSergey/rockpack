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

  if (global.ISOMORPHIC) {
    if (isArray(conf.vendor)) {
      entry.vendor = conf.vendor;
    }
    const entryPoint = path.basename(conf.dist)
      .replace(distExtension, '');

    entry[entryPoint] = path.resolve(root, conf.src);
    context = path.dirname(entry[entryPoint]);

    if (
      !conf.__library &&
      mode === 'development' &&
      !conf.nodejs
    ) {
      entry['dev-server'] = require.resolve('webpack-plugin-serve/client');
    }
  } else {
    // eslint-disable-next-line
    if (mode === 'development') {
      entry = [
        path.resolve(root, conf.src)
      ];
      if (
        !conf.__library &&
        !conf.nodejs
      ) {
        entry.push(require.resolve('webpack-plugin-serve/client'));
      }
    } else if (mode === 'production') {
      if (isArray(conf.vendor)) {
        entry.vendor = conf.vendor;
      }
      const entryPoint = path.basename(conf.dist)
        .replace(distExtension, '');

      entry[entryPoint] = path.resolve(root, conf.src);
      context = path.dirname(entry[entryPoint]);
    }
  }

  return { entry, context };
};

module.exports = makeEntry;
