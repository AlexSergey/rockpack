const { setMode } = require('../utils/setMode');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function webViewCompiler(conf = {}, cb, configOnly = false) {
  setMode();
  if (!conf) {
    conf = {};
  }
  errorHandler();
  conf.webview = true;
  conf.compilerName = webViewCompiler.name;
  return await _compile(conf, cb, configOnly);
}

module.exports = webViewCompiler;
