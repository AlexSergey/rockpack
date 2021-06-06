const { setMode } = require('../utils/setMode');
const _compile = require('../core/_compile');

async function makeWebpackConfig(options = {}, cb) {
  setMode();
  const { webpackConfig } = await _compile(options, cb, true);
  return webpackConfig;
}

module.exports = makeWebpackConfig;
