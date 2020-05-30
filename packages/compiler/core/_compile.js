const webpack = require('webpack');
const makeMode = require('../modules/makeMode');
const mergeConfWithDefault = require('../modules/mergeConfWithDefault');
const _make = require('./_make');
const run = require('../modules/run');

const _compile = async (conf = {}, post, withoutRun = false) => {
  const mode = makeMode();
  conf = await mergeConfWithDefault(conf, mode);
  conf.progress = true;
  const webpackConfig = await _make(conf, post);
  if ((typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun)) {
    return { webpackConfig, conf };
  }
  await run(webpackConfig, mode, webpack, conf);
};

module.exports = _compile;
