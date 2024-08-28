const path = require('node:path');
const R = require('ramda');

const isMapFile = R.endsWith('.map');
const getOutputFileName = R.pipe(R.prop('assets'), R.keys, R.reject(isMapFile), R.head);

const getOutputFileMeta = (compilation, outputPath) => {
  const outputFileName = getOutputFileName(compilation);
  const absoluteFileName = path.join(outputPath, outputFileName);

  return path.relative('', absoluteFileName);
};

module.exports = {
  getOutputFileMeta,
};
