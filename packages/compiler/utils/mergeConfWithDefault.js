const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const fpPromise = require('./findFreePort');

const mergeConfWithDefault = async (conf, mode) => {
  const c = deepExtend({}, defaultProps, conf);

  if (mode === 'development') {
    c.port = await fpPromise(c.port);
  }

  return c;
};

module.exports = mergeConfWithDefault;
