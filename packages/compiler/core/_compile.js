const webpack = require('webpack');
const getMode = require('../utils/getMode');
const mergeConfWithDefault = require('../utils/mergeConfWithDefault');
const mergeLocalizationConfWithDefault = require('../localazer/utils/mergeLocalizationConfWithDefault');
const _make = require('./_make');
const _innerProps = require('./_innerProps');
const _run = require('./_run');

const _compile = async (conf = {}, post, withoutRun = false) => {
  const mode = getMode();
  conf = conf.makePOT ?
    await mergeLocalizationConfWithDefault(conf, mode) :
    await mergeConfWithDefault(conf, mode);
  conf = await _innerProps(conf, mode);
  const finalConfig = await _make(conf, post);

  if ((typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun)) {
    return {
      webpackConfig: finalConfig.webpackConfig,
      conf: finalConfig.conf
    };
  }

  await _run(finalConfig.webpackConfig, mode, webpack, finalConfig.conf);
};

module.exports = _compile;
