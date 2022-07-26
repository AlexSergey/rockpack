const { getMode } = require('@rockpack/utils');
const webpack = require('webpack');

const mergeConfWithDefault = require('../utils/merge-conf-with-default');

const _args = require('./_args');
const _innerProps = require('./_inner-props');
const _make = require('./_make');
const _run = require('./_run');

// eslint-disable-next-line default-param-last
const _compile = async (conf = {}, post, withoutRun = false) => {
  const mode = getMode();
  conf = await mergeConfWithDefault(conf, mode);
  conf = await _innerProps(conf, mode);
  conf = await _args(conf, mode);
  const finalConfig = await _make(conf, post);

  if (typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun) {
    return {
      conf: finalConfig.conf,
      webpackConfig: finalConfig.webpackConfig,
    };
  }

  return await _run(finalConfig.webpackConfig, mode, webpack, finalConfig.conf);
};

module.exports = _compile;
