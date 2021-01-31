const deepExtend = require('deep-extend');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');
const getMode = require('../utils/getMode');

async function backendCompiler(conf = {}, cb, configOnly = false) {
  if (!conf) {
    conf = {};
  }

  errorHandler();
  const mode = getMode();
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;

  conf = deepExtend({}, conf, {
    html: false,
    nodejs: true,
    __isBackend: true,
    compilerName: backendCompiler.name
  });

  return await _compile(conf, cb, configOnly);
}

module.exports = backendCompiler;
