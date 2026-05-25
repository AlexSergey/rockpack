import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { InternalCompilerConf } from '../types.js';

const argv = yargs(hideBin(process.argv)).parseSync();

export const addArgs = (conf: InternalCompilerConf): InternalCompilerConf => {
  if ((argv as Record<string, unknown>)['analyzer']) {
    if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      conf.analyzer = false;
    } else {
      conf.analyzer = true;
    }
  }

  return conf;
};
