const deepExtend = require('deep-extend');
const { setMode } = require('@rockpack/utils');
const _compile = require('../core/_compile');
const errors = require('../errors/markupCompiler');
const errorHandler = require('../errorHandler');
const findHTML = require('../utils/findHTML');

async function markupCompiler(pth, conf = {}, cb, configOnly = false) {
  setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }

  errorHandler();

  if (!pth) {
    console.error(errors.PATH_CANT_BE_EMPTY);
    return process.exit(1);
  }

  try {
    const html = await findHTML(pth, conf.html);

    conf = deepExtend({}, conf, {
      html
    });

    conf.compilerName = markupCompiler.name;
    return await _compile(conf, cb, configOnly);
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

module.exports = markupCompiler;
