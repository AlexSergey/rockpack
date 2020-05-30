const makeDevtool = (mode, conf) => {
  let sourceMap = mode === 'development' ? 'eval-source-map' : false;

  if (mode === 'production' && conf.debug) {
    sourceMap = 'source-map';
  }

  return sourceMap;
};

module.exports = makeDevtool;
