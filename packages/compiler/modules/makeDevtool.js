const makeDevtool = (mode, conf) => {
  let sourceMap = mode === 'development' ? 'source-map' : false;

  if (mode === 'development' && conf.nodejs) {
    sourceMap = 'source-map';
  }

  if (conf.debug) {
    sourceMap = 'source-map';
  }

  if (mode === 'development' && conf.webview) {
    sourceMap = 'eval';
  }

  return sourceMap;
};

module.exports = makeDevtool;
