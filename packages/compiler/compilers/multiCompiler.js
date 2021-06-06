const webpack = require('webpack');
const { isNumber } = require('valid-types');
const { setMode } = require('../utils/setMode');
const fpPromise = require('../utils/findFreePort');
const _compile = require('../core/_compile');
const defaultProps = require('../defaultProps');
const _run = require('../core/_run');
const getRandom = require('../utils/getRandom');
const getMode = require('../utils/getMode');
const commonMultiValidator = require('../utils/commonMultiValidators');
const errorHandler = require('../errorHandler');

async function multiCompiler(...props) {
  setMode();
  errorHandler();
  const mode = getMode();

  global.CONFIG_ONLY = true;
  global.IGNORE_SERVE = true;

  for (let i = 0, l = props.length; i < l; i++) {
    if (typeof props[i].then === 'function') {
      props[i] = await props[i];
    }
  }

  const configs = props.map(c => c.conf);

  commonMultiValidator(configs);

  const ports = {};
  const portsDev = [];
  const webpackConfigs = [];

  // set id
  configs.forEach((config, index) => {
    config.id = `config-${index}`;
    ports[config.id] = {};
  });

  // check intersection ports
  for (let i = 0, l = configs.length; i < l; i++) {
    const config = configs[i];

    if (config && isNumber(config.port)) {
      if (!ports[config.id].port) {
        let port = await fpPromise(config.port);
        if (portsDev.indexOf(port) >= 0) {
          port = await fpPromise(config.port + getRandom(100));
        }
        portsDev.push(port);
        ports[config.id].port = port;
      }
    } else {
      let port = await fpPromise(defaultProps.port);
      if (portsDev.indexOf(port) >= 0) {
        port = await fpPromise(defaultProps.port + getRandom(100));
      }
      ports[config.id].port = port;
      portsDev.push(port);
    }
  }

  configs.forEach((config) => {
    if (isNumber(ports[config.id].port)) {
      config.port = ports[config.id].port;
    }
  });
  global.IGNORE_SERVE = false;

  for (let i = 0, l = configs.length; i < l; i++) {
    const config = configs[i];

    const { webpackConfig, conf } = await _compile(config, () => {
    }, true);

    configs[i] = conf;
    webpackConfigs.push(webpackConfig);
  }
  configs.compilerName = multiCompiler.name;

  return await _run(webpackConfigs, mode, webpack, configs);
}

module.exports = multiCompiler;
