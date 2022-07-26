const { setMode } = require('@rockpack/utils');

const _compile = require('../core/_compile');

// eslint-disable-next-line default-param-last
async function makeWebpackConfig(options = {}, cb) {
  setMode(['development', 'production'], 'development');
  const { webpackConfig } = await _compile(options, cb, true);

  return webpackConfig;
}

module.exports = makeWebpackConfig;
