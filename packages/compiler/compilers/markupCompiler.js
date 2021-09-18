const deepExtend = require('deep-extend');
const { setMode } = require('@rockpack/utils');
const _compile = require('../core/_compile');
const errors = require('../errors/markupCompiler');
const errorHandler = require('../errorHandler');
const findHTML = require('../utils/findHTML');
const _devServer = require('../core/_devServer');

async function markupCompiler(pth, conf = {}, cb, configOnly = false) {
  const mode = setMode(['development', 'production'], 'development');
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
    console.log('html', html);
    conf = deepExtend({}, conf, {
      html
    });

    conf.name = markupCompiler.name;
    conf.compilerName = markupCompiler.name;
    const result = await _compile(conf, cb, configOnly);

    if (configOnly) {
      return result;
    }
    if (global.ISOMORPHIC) {
      return result;
    }

    if (mode === 'development' || conf.debug) {
      _devServer(result);
    }
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

module.exports = markupCompiler;
