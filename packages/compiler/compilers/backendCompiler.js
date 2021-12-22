const deepExtend = require('deep-extend');
const { setMode } = require('@rockpack/utils');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

// eslint-disable-next-line default-param-last
async function backendCompiler(conf = {}, cb, configOnly = false) {
  setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }

  errorHandler();

  conf = deepExtend({}, conf, {
    html: false,
    nodejs: true,
    __isBackend: true,
    compilerName: backendCompiler.name
  });
  conf.name = backendCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = backendCompiler;
