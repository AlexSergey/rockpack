const deepExtend = require('deep-extend');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');
const makeMode = require('../modules/makeMode');

async function backendCompiler(conf = {}, cb, configOnly = false) {
  errorHandler();
  const mode = makeMode();
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
