const webpack = require('webpack');
const { getMode } = require('@rockpack/utils');
const mergeConfWithDefault = require('../utils/mergeConfWithDefault');
const _make = require('./_make');
const _innerProps = require('./_innerProps');
const _args = require('./_args');
const _run = require('./_run');

const _compile = async (conf = {}, post, withoutRun = false) => {
  const mode = getMode();
  conf = await mergeConfWithDefault(conf, mode);
  conf = await _innerProps(conf, mode);
  conf = await _args(conf, mode);
  const finalConfig = await _make(conf, post);

  if ((typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun)) {
    return {
      webpackConfig: finalConfig.webpackConfig,
      conf: finalConfig.conf
    };
  }

  return await _run(finalConfig.webpackConfig, mode, webpack, finalConfig.conf);
};

module.exports = _compile;
