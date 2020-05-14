const deepExtend = require('deep-extend');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');
const makeMode = require('../modules/makeMode');

async function backendCompiler(options = {}, cb, configOnly = false) {
  errorHandler();
  const mode = makeMode();
  options = deepExtend({}, options, {
    html: false,
    nodejs: true,
  });
  options.__isBackend = true;
  if (mode === 'development') {
    options._liveReload = true;
  }
  return await _compile(options, cb, configOnly);
}

module.exports = backendCompiler;
