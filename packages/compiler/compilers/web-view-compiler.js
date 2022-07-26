const { setMode } = require('@rockpack/utils');

const _compile = require('../core/_compile');
const errorHandler = require('../error-handler');

// eslint-disable-next-line default-param-last
async function webViewCompiler(conf = {}, cb, configOnly = false) {
  setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }
  errorHandler();
  conf.webview = true;
  conf.name = webViewCompiler.name;
  conf.compilerName = webViewCompiler.name;

  return await _compile(conf, cb, configOnly);
}

module.exports = webViewCompiler;
