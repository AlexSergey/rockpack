import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { getArgv } from './argv.js';

export const addArgs = (conf: InternalCompilerConf, context: CompileContext): InternalCompilerConf => {
  if (getArgv()['analyzer']) {
    if (context.isomorphic && conf.__isIsomorphicBackend) {
      conf.analyzer = false;
    } else {
      conf.analyzer = true;
    }
  }

  return conf;
};
