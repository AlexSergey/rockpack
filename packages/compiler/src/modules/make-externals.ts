import nodeExternals from 'webpack-node-externals';

import type { InternalCompilerConf } from '../types.js';

import { getNodeModules } from '../utils/get-node-modules.js';

export const makeExternals = (conf: Partial<InternalCompilerConf>, root: string): unknown =>
  conf.__isBackend && !conf.__isIsomorphicBackend ? nodeExternals({ additionalModuleDirs: getNodeModules(root) }) : [];
