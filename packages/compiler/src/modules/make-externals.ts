import nodeExternals from 'webpack-node-externals';

import type { CompilerConf } from '../types.js';

import { getNodeModules } from '../utils/get-node-modules.js';

export const makeExternals = (conf: Partial<CompilerConf>, root: string): unknown =>
  conf.__isBackend && !conf.__isIsomorphicBackend ? nodeExternals({ additionalModuleDirs: getNodeModules(root) }) : [];
