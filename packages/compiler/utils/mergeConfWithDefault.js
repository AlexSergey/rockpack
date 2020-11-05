const path = require('path');
const chalk = require('chalk');
const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const fpPromise = require('./findFreePort');
const { defaultDistFile, distExtension } = require('../constants');

const mergeConfWithDefault = async (conf, mode) => {
  const c = deepExtend({}, defaultProps, conf);

  if (path.extname(path.basename(c.dist)) !== distExtension) {
    if (typeof c.dist === 'string' && c.dist.length > 0) {
      c.dist = path.join(c.dist, `${defaultDistFile}${distExtension}`);
      c.distContext = c.dist;
    } else {
      c.dist = defaultProps.dist;
      c.distContext = path.dirname(defaultProps.dist);
    }

    console.log(`The distribution folder will be ${chalk.green(c.dist)}`);
  } else {
    c.distContext = path.dirname(c.dist);
  }

  if (mode === 'development') {
    c.port = await fpPromise(c.port);
  }

  return c;
};

module.exports = mergeConfWithDefault;
