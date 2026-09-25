import deepExtend from 'deep-extend';
import path from 'node:path';

import type { InternalCompilerConf, Mode } from '../types.js';

import { defaultDistFile, distExtension } from '../constants.js';
import { defaultProps } from '../default-props.js';
import { fpPromise } from './find-free-port.js';

export const mergeConfWithDefault = async (
  conf: Partial<InternalCompilerConf>,
  mode: Mode,
): Promise<InternalCompilerConf> => {
  const c = deepExtend({}, defaultProps, conf) as InternalCompilerConf;

  if (path.extname(path.basename(c.dist)) !== distExtension) {
    if (typeof c.dist === 'string' && c.dist.length > 0) {
      c.dist = path.join(c.dist, `${defaultDistFile}${distExtension}`);
      c.distContext = path.dirname(c.dist);
    } else {
      c.dist = defaultProps.dist;
      c.distContext = path.dirname(defaultProps.dist);
    }
  } else {
    c.distContext = path.dirname(c.dist);
  }

  if (mode === 'development') {
    c.port = await fpPromise(c.port ?? 3000);
  }

  return c;
};
