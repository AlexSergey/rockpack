import ansiColors from 'ansi-colors';
import deepExtend from 'deep-extend';
import path from 'node:path';

import type { CompilerConf, Mode } from '../types.js';

import { defaultDistFile, distExtension } from '../constants.js';
import { defaultProps } from '../default-props.js';
import { fpPromise } from './find-free-port.js';

export const mergeConfWithDefault = async (conf: Partial<CompilerConf>, mode: Mode): Promise<CompilerConf> => {
  const c = deepExtend({}, defaultProps, conf) as CompilerConf;

  if (path.extname(path.basename(c.dist)) !== distExtension) {
    if (typeof c.dist === 'string' && c.dist.length > 0) {
      c.dist = path.join(c.dist, `${defaultDistFile}${distExtension}`);
      c.distContext = c.dist;
    } else {
      c.dist = defaultProps.dist;
      c.distContext = path.dirname(defaultProps.dist);
    }
    console.log(`The distribution folder will be ${ansiColors.green(c.dist)}`);
  } else {
    c.distContext = path.dirname(c.dist);
  }

  if (mode === 'development') {
    c.port = await fpPromise(c.port ?? 3000);
  }

  return c;
};
