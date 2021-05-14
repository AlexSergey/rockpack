const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');
const getMode = require('../utils/getMode');

async function webViewCompiler(conf = {}, cb, configOnly = false) {
  if (!conf) {
    conf = {};
  }
  errorHandler();
  const mode = getMode();
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
  conf.webview = true;
  conf.compilerName = webViewCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = webViewCompiler;
