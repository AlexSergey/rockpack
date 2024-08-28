const { getMode, setMode } = require('@rockpack/utils');
const livereload = require('livereload');
const { isUndefined } = require('valid-types');
const webpack = require('webpack');

const _run = require('../core/_run');
const errorHandler = require('../error-handler');
const errors = require('../errors/isomorphic-compiler');

// eslint-disable-next-line consistent-return
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

  const webpackConfigs = props.map((c) => c.webpackConfig);
  const configs = props.map((c) => c.conf);
  configs.compilerName = isomorphicCompiler.name;

  const backend = configs.find((p) => p.compilerName === 'backendCompiler');

  const frontend = configs.find((p) => p.compilerName === 'frontendCompiler');

  if (!frontend) {
    // eslint-disable-next-line no-console
    console.error(errors.SUPPORT);

    return process.exit(1);
  }

  if (!backend) {
    // eslint-disable-next-line no-console
    console.error(errors.BACKEND_IS_REQUIRED);

    return process.exit(1);
  }

  if (Object.keys(configs) <= 1) {
    // eslint-disable-next-line no-console
    console.error(errors.SHOULD_SET_MORE_THEN_ONE_COMPILERS);

    return process.exit(1);
  }

  configs.forEach((prop) => {
    // eslint-disable-next-line consistent-return
    ['dist', 'src'].forEach((option) => {
      if (isUndefined(prop[option])) {
        // eslint-disable-next-line no-console
        console.error(errors.SHOULD_SET_OPTION(prop.compilerName, option));

        return process.exit(1);
      }
    });
  });

  await _run(webpackConfigs, mode, webpack, configs);
}

module.exports = isomorphicCompiler;
