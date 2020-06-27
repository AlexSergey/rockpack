const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const fpPromise = require('./findFreePort');

const mergeConfWithDefault = async (conf, mode) => {
  const c = deepExtend({}, defaultProps, conf);

  if (mode === 'development') {
    c.server = await fpPromise(c.server);
  }

  return c;
};

module.exports = mergeConfWithDefault;
