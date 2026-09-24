import type { InternalCompilerConf, Mode } from '../types.js';

export const innerProps = (conf: InternalCompilerConf, mode: Mode): InternalCompilerConf => {
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
        conf.html ??= false;
        break;

      case undefined:
      default:
        break;
    }
  }

  return conf;
};
