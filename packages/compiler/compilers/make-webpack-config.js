const { setMode } = require('@rockpack/utils');

const _compile = require('../core/_compile');

async function makeWebpackConfig(options = {}, cb) {
  setMode(['development', 'production'], 'development');
  const { webpackConfig } = await _compile(options, cb, true);

  return webpackConfig;
}

module.exports = makeWebpackConfig;
