const webpack = require('webpack');
const { isNumber } = require('valid-types');
const fpPromise = require('../utils/findFreePort');
const _compile = require('../core/_compile');
const defaultProps = require('../defaultProps');
const _run = require('../core/_run');
const getRandom = require('../utils/getRandom');
const getMode = require('../utils/getMode');
const commonMultiValidator = require('../utils/commonMultiValidators');
const errorHandler = require('../errorHandler');

async function multiCompiler(...props) {
  errorHandler();
  const mode = getMode();

  global.CONFIG_ONLY = true;

  for (let i = 0, l = props.length; i < l; i++) {
    if (typeof props[i].then === 'function') {
      props[i] = await props[i];
    }
  }

  props = props.map(c => c.conf);

  commonMultiValidator(props);

  const ports = {};
  const serverDev = [];
  const configs = {};
  const webpackConfigs = [];

  // set id
  props.forEach((config, index) => {
    config.id = `config-${index}`;
    ports[config.id] = {};
    configs[config.id] = {};
  });

  // check intersection ports
  for (let i = 0, l = props.length; i < l; i++) {
    const config = props[i];

    if (config && isNumber(config.server)) {
      if (!ports[config.id].server) {
        let port = await fpPromise(config.server);
        if (serverDev.indexOf(port) >= 0) {
          port = await fpPromise(config.server + getRandom(100));
        }
        serverDev.push(port);
        ports[config.id].server = port;
      }
    } else {
      let port = await fpPromise(defaultProps.port);
      if (serverDev.indexOf(port) >= 0) {
        port = await fpPromise(defaultProps.port + getRandom(100));
      }
      ports[config.id].server = port;
      serverDev.push(port);
    }
  }

  props.forEach((config) => {
    if (isNumber(ports[config.id].server)) {
      config.server = ports[config.id].server;
    }
  });

  for (let i = 0, l = props.length; i < l; i++) {
    const config = props[i];
    const { webpackConfig, conf } = await _compile(config, () => {}, true);
    props[i] = conf;
    webpackConfigs.push(webpackConfig);
  }

  return await _run(webpackConfigs, mode, webpack, props);
}

module.exports = multiCompiler;
