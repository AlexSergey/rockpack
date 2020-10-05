const path = require('path');
const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const fpPromise = require('./findFreePort');
const { defaultDistFile, distExtension } = require('../constants');

const mergeConfWithDefault = async (conf, mode) => {
  const c = deepExtend({}, defaultProps, conf);

  if (path.extname(path.basename(c.dist)) !== distExtension) {
    console.error('Incorrect dist option');

    c.dist = typeof c.dist === 'string' && c.dist.length > 0 ?
      path.join(c.dist, `${defaultDistFile}${distExtension}`) :
      defaultProps.dist;

    console.error(`The dist option will be ${c.dist}`);
  }

  if (mode === 'development') {
    c.port = await fpPromise(c.port);
  }

  return c;
};

module.exports = mergeConfWithDefault;
