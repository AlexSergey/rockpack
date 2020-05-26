const path = require('path');
const { isArray } = require('valid-types');

const getOutput = (conf = {}, root, version = '') => {
  const outputProps = {
    pathinfo: false,
    publicPath: conf.url,
    path: path.resolve(root, conf.dist)
  };
  if (conf.__frontendHasVendor) {
    outputProps.filename = version ? `[name]-${version}.js` : '[name].js';
  } else if (isArray(conf.vendor)) {
    outputProps.filename = version ? `[name]-${version}.js` : '[name].js';
  } else {
    outputProps.filename = chunkData => (
      chunkData.chunk.name === 'main' ?
        (version ? `index-${version}.js` : 'index.js') :
        version ? `[name]-${version}.js` : '[name].js');
  }

  if (conf.library) {
    Object.assign(outputProps, {
      library: conf.library,
      libraryTarget: 'umd',
      globalObject: 'this'
    });
  }

  return outputProps;
};

module.exports = getOutput;
