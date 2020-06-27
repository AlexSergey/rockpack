const webpack = require('webpack');
const getMode = require('../utils/getMode');
const mergeConfWithDefault = require('../utils/mergeConfWithDefault');
const _make = require('./_make');
const _run = require('./_run');

const _compile = async (conf = {}, post, withoutRun = false) => {
  const mode = getMode();
  conf = await mergeConfWithDefault(conf, mode);
  conf.progress = true;
  const webpackConfig = await _make(conf, post);
  if ((typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun)) {
    return { webpackConfig, conf };
  }
  await _run(webpackConfig, mode, webpack, conf);
};

module.exports = _compile;
