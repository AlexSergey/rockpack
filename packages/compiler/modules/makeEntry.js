const { isString } = require('valid-types');
const path = require('path');

const makeEntry = (conf, root, mode) => {
  if (!isString(conf.src)) {
    console.error('Src must be a string!');
    process.exit(1);
  }

  const entry = {
    index: path.resolve(root, conf.src)
  };

  if (
    !conf.onlyWatch &&
    !conf.nodejs &&
    mode === 'development'
  ) {
    entry['dev-server-client'] = `${require.resolve('webpack-dev-server/client')}?http://localhost:${conf.port}/`;
    entry['dev-server-hot'] = require.resolve('webpack/hot/dev-server');
  }

  return entry;
};

module.exports = makeEntry;
