const path = require('node:path');

const chalk = require('chalk');
const deepExtend = require('deep-extend');

const { defaultDistFile, distExtension } = require('../constants');
const defaultProps = require('../default-props');

const fpPromise = require('./find-free-port');

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

    // eslint-disable-next-line no-console
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
