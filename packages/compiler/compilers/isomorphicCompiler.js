const webpack = require('webpack');
const { isUndefined } = require('valid-types');
const livereload = require('livereload');
const { setMode, getMode } = require('@rockpack/utils');
const errors = require('../errors/isomorphicCompiler');
const errorHandler = require('../errorHandler');
const _run = require('../core/_run');

async function isomorphicCompiler(...props) {
  setMode(['development', 'production'], 'development');
  errorHandler();
  const mode = getMode();
  global.ISOMORPHIC = true;
  global.CONFIG_ONLY = true;
  const lrserver = livereload.createServer();
  global.LIVE_RELOAD_PORT = lrserver.config.port;
  global.LIVE_RELOAD_SERVER = lrserver;

  for (let i = 0, l = props.length; i < l; i++) {
    props[i] = await props[i];
  }

  const webpackConfigs = props.map(c => c.webpackConfig);
  const configs = props.map(c => c.conf);
  configs.compilerName = isomorphicCompiler.name;

  const backend = configs.find(p => p.compilerName === 'backendCompiler');

  const frontend = configs.find(p => p.compilerName === 'frontendCompiler');

  if (!frontend) {
    console.error(errors.SUPPORT);
    return process.exit(1);
  }

  if (!backend) {
    console.error(errors.BACKEND_IS_REQUIRED);
    return process.exit(1);
  }

  if (Object.keys(configs) <= 1) {
    console.error(errors.SHOULD_SET_MORE_THEN_ONE_COMPILERS);
    return process.exit(1);
  }

  configs.forEach(prop => {
    ['dist', 'src'].forEach(option => {
      if (isUndefined(prop[option])) {
        console.error(errors.SHOULD_SET_OPTION(prop.compilerName, option));
        return process.exit(1);
      }
    });
  });

  await _run(webpackConfigs, mode, webpack, configs);
}

module.exports = isomorphicCompiler;
