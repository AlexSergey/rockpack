const _compile = require('../core/_compile');
const getMode = require('../utils/getMode');

async function makeWebpackConfig(options = {}, cb) {
  const mode = getMode();
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
  const { webpackConfig } = await _compile(options, cb, true);
  return webpackConfig;
}

module.exports = makeWebpackConfig;
