const { setMode } = require('@rockpack/utils');
const deepExtend = require('deep-extend');

const _compile = require('../core/_compile');
const errorHandler = require('../error-handler');

async function backendCompiler(conf = {}, cb, configOnly = false) {
  setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }

  errorHandler();

  conf = deepExtend({}, conf, {
    __isBackend: true,
    compilerName: backendCompiler.name,
    html: false,
    nodejs: true,
  });
  conf.name = backendCompiler.name;

  return await _compile(conf, cb, configOnly);
}

module.exports = backendCompiler;
