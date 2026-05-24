import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { CompilerConf } from '../types.js';

const argv = yargs(hideBin(process.argv)).parseSync();

export const addArgs = (conf: CompilerConf): CompilerConf => {
  if ((argv as Record<string, unknown>)['analyzer']) {
    if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      conf.analyzer = false;
    } else {
      conf.analyzer = true;
    }
  }

  return conf;
};
