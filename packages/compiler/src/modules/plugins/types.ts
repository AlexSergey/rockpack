import type webpack from 'webpack';

import type { InternalCompilerConf, Mode, PackageJson } from '../../types.js';

export type PluginContext = {
  readonly conf: InternalCompilerConf;
  readonly context: string;
  readonly mode: Mode;
  readonly packageJson: PackageJson;
  readonly root: string;
  readonly wp: typeof webpack;
};

export type PluginEntries = Record<string, unknown>;
