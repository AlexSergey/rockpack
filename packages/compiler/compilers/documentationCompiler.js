const { isUndefined } = require('valid-types');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function documentationCompiler(options = {}, cb, configOnly = false) {
  if (!options) {
    options = {};
  }
  if (options && isUndefined(options.inline)) {
    options.inline = false;
  }
  options.__isDocumentation = true;

  errorHandler();
  return await _compile(options, cb, configOnly);
}

module.exports = documentationCompiler;
