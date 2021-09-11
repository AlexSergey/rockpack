const path = require('path');
const { isString, isArray } = require('valid-types');
const { distExtension } = require('../constants');

const makeEntry = (conf, root, mode) => {
  if (!isString(conf.src)) {
    console.error('Src must be a string!');
    process.exit(1);
  }

  const entry = {};

  const entryPoint = path.basename(conf.dist)
    .replace(distExtension, '');

  if (isArray(conf.vendor)) {
    entry.vendor = conf.vendor;
  }

  if (conf.__isIsomorphicFrontend && mode === 'development') {
    entry['dev-server'] = require.resolve('../plugins/Reloader/ssr');
  }

  entry[entryPoint] = path.resolve(root, conf.src);
  const context = path.dirname(entry[entryPoint]);

  return { entry, context };
};

module.exports = makeEntry;
