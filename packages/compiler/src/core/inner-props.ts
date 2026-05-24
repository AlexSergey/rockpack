import { isDefined } from 'valid-types';

import type { CompilerConf, Mode } from '../types.js';

export const innerProps = (conf: CompilerConf, mode: Mode): CompilerConf => {
  conf.messages = [];

  if (global.ISOMORPHIC) {
    switch (conf.compilerName) {
      case 'backendCompiler':
        conf.__isIsomorphic = true;
        conf.__isIsomorphicBackend = true;
        conf.__isIsomorphicStyles = true;
        break;

      case 'frontendCompiler':
        conf.__isIsomorphic = true;
        if (mode === 'development') {
          conf.__isIsomorphicStyles = true;
        }
        conf.__isIsomorphicFrontend = true;
        if (!isDefined(conf.html)) {
          conf.html = false;
        }
        break;
    }
  }

  return conf;
};
