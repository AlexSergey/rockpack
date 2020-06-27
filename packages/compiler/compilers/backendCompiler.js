const deepExtend = require('deep-extend');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');
const getMode = require('../utils/getMode');

async function backendCompiler(conf = {}, cb, configOnly = false) {
  errorHandler();
  const mode = getMode();
  conf = deepExtend({}, conf, {
    html: false,
    nodejs: true,
  });
  conf.__isBackend = true;
  if (mode === 'development') {
    conf._liveReload = true;
  }
  conf.compilerName = backendCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = backendCompiler;
