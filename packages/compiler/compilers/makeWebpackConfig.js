const _compile = require('../core/_compile');

async function makeWebpackConfig(options = {}, cb) {
  const { webpackConfig } = await _compile(options, cb, true);
  return webpackConfig;
}

module.exports = makeWebpackConfig;
