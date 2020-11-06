const webpack = require('webpack');
const { isUndefined } = require('valid-types');
const createUssrObserver = require('@rockpack/webpack-plugin-ussr-development');
const errors = require('../errors/isomorphicCompiler');
const getMode = require('../utils/getMode');
const errorHandler = require('../errorHandler');
const _run = require('../core/_run');

async function isomorphicCompiler(...props) {
  errorHandler();
  createUssrObserver();
  global.ISOMORPHIC = true;
  global.CONFIG_ONLY = true;

  for (let i = 0, l = props.length; i < l; i++) {
    props[i] = await props[i];
  }

  const webpackConfigs = props.map(c => c.webpackConfig);
  const configs = props.map(c => c.conf);
  configs.compilerName = isomorphicCompiler.name;
  const mode = getMode();

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

  return await _run(webpackConfigs, mode, webpack, configs);
}

module.exports = isomorphicCompiler;
