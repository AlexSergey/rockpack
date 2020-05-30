const webpack = require('webpack');
const { isNumber } = require('valid-types');
const fpPromise = require('../utils/findFreePort');
const _compile = require('../core/_compile');
const defaultProps = require('../defaultProps');
const run = require('../modules/run');
const getRandom = require('../utils/getRandom');
const makeMode = require('../modules/makeMode');
const commonMultiValidator = require('../utils/commonMultiValidators');
const errorHandler = require('../errorHandler');

async function multiCompiler(...props) {
  errorHandler();
  const mode = makeMode();
  const isIsomorphic = Boolean(global.ISOMORPHIC);

  if (isIsomorphic) {
    props.compilerName = 'isomorphicCompiler';
  } else {
    global.CONFIG_ONLY = true;
    for (let i = 0, l = props.length; i < l; i++) {
      if (typeof props[i].then === 'function') {
        props[i] = await props[i];
      }
    }
    props = props.map(c => c.conf);
  }

  commonMultiValidator(props);

  const ports = {};
  const serverDev = [];
  const configs = {};
  const webpackConfigs = [];
  const liveReload = [];

  // set id
  props.forEach((config, index) => {
    config.id = `config-${index}`;
    ports[config.id] = {};
    configs[config.id] = {};
  });

  // check intersection ports
  for (let i = 0, l = props.length; i < l; i++) {
    const config = props[i];

    if (!ports[config.id].liveReload) {
      let port = await fpPromise(35729);
      if (liveReload.indexOf(port) >= 0) {
        port = await fpPromise(35729 + getRandom(100));
      }
      liveReload.push(port);
      ports[config.id].liveReload = port;
    }

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
      let port = await fpPromise(defaultProps.server);
      if (serverDev.indexOf(port) >= 0) {
        port = await fpPromise(defaultProps.server + getRandom(100));
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

  return await run(webpackConfigs, mode, webpack, props);
}

module.exports = multiCompiler;
