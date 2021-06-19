const { setMode } = require('@rockpack/utils');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function frontendCompiler(conf = {}, cb, configOnly = false) {
  setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }
  errorHandler();
  conf.compilerName = frontendCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = frontendCompiler;
