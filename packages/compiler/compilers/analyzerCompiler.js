const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function analyzerCompiler(conf = {}, cb, configOnly = false) {
  errorHandler();
  conf.compilerName = analyzerCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = analyzerCompiler;
