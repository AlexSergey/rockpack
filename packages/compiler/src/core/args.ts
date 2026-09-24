import type { InternalCompilerConf } from '../types.js';

import { getArgv } from './argv.js';

export const addArgs = (conf: InternalCompilerConf): InternalCompilerConf => {
  if (getArgv()['analyzer']) {
    if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      conf.analyzer = false;
    } else {
      conf.analyzer = true;
    }
  }

  return conf;
};
