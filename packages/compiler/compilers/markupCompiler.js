const deepExtend = require('deep-extend');
const { isDefined, isUndefined, isArray } = require('valid-types');
const path = require('path');
const glob = require('glob');
const _compile = require('../core/_compile');
const errors = require('../errors/markupCompiler');
const errorHandler = require('../errorHandler');

function _getOptions(pth, conf = {}) {
  return new Promise((resolve, reject) => {
    glob(pth, { absolute: true }, async (err, files) => {
      if (err) {
        return reject(err);
      }
      if (files.length === 0) {
        console.error(errors.INVALID_PATH);
        return process.exit(1);
      }
      let html = isUndefined(conf.html) ? [] : conf.html;
      html = isDefined(html) ? (isArray(html) ? html : [html]) : [];

      conf = deepExtend({}, conf, {
        html: html.concat(files.map(file => ({
          template: path.resolve(file)
        })))
      });

      return resolve(conf);
    });
  });
}

async function markupCompiler(pth, conf = {}, cb, configOnly = false) {
  errorHandler();
  if (!pth) {
    console.error(errors.PATH_CANT_BE_EMPTY);
    return process.exit(1);
  }
  if ((process.env.NODE_ENV || 'development') === 'development') {
    conf._liveReload = true;
  }
  try {
    conf = await _getOptions(pth, conf);
    conf.compilerName = markupCompiler.name;
    return await _compile(conf, cb, configOnly);
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

module.exports = markupCompiler;
