const { setMode } = require('@rockpack/utils');
const deepExtend = require('deep-extend');

const _compile = require('../core/_compile');
const _devServer = require('../core/_dev-server');
const errorHandler = require('../error-handler');
const errors = require('../errors/markup-compiler');
const findHTML = require('../utils/find-html');

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
    conf = deepExtend({}, conf, {
      html,
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
