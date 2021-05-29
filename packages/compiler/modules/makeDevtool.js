const makeDevtool = (mode, conf) => {
  let sourceMap = mode === 'development' ? 'cheap-module-source-map' : false;

  if (mode === 'development' && conf.nodejs) {
    sourceMap = 'source-map';
  }

  if (conf.debug) {
    sourceMap = 'cheap-module-source-map';
  }

  if (mode === 'development' && conf.webview) {
    sourceMap = 'cheap-module-source-map';
  }

  return sourceMap;
};

module.exports = makeDevtool;
