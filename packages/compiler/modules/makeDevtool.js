const makeDevtool = (mode, conf) => {
  let sourceMap = mode === 'development' ? 'eval-source-map' : false;

  if (mode === 'development' && conf.nodejs) {
    sourceMap = 'source-map';
  }

  if (conf.debug) {
    sourceMap = 'source-map';
  }

  return sourceMap;
};

module.exports = makeDevtool;
