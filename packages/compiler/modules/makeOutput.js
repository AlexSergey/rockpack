const path = require('path');

const makeOutput = (conf = {}, root, version = '') => {
  const outputProps = {
    pathinfo: false,
    publicPath: '/',
    path: path.resolve(root, conf.dist),
    filename: chunkData => (
      chunkData.chunk.name === 'main' ?
        (version ? `index-${version}.js` : 'index.js') :
        version ? `[name]-${version}.js` : '[name].js'
    )
  };

  if (conf.library) {
    Object.assign(outputProps, {
      library: conf.library,
      libraryTarget: 'umd',
      globalObject: 'this'
    });
  }

  return outputProps;
};

module.exports = makeOutput;
