const { setMode } = require('@rockpack/utils');

const _compile = require('../core/_compile');
const _devServer = require('../core/_dev-server');
const errorHandler = require('../error-handler');

async function frontendCompiler(conf = {}, cb, configOnly = false) {
  const mode = setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }
  errorHandler();
  conf.name = frontendCompiler.name;
  conf.compilerName = frontendCompiler.name;
  const result = await _compile(conf, cb, configOnly);

  if (configOnly) {
    return result;
  }
  if (global.ISOMORPHIC) {
    return result;
  }

  if (mode === 'development' || conf.debug) {
    _devServer(result);
  }
}

module.exports = frontendCompiler;
