const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function frontendCompiler(conf = {}, cb, configOnly = false) {
  errorHandler();
  conf.compilerName = frontendCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = frontendCompiler;
