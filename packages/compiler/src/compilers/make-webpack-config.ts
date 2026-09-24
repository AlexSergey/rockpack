import type { Configuration } from 'webpack';

import { setMode } from '@rockpack/utils';

import type { CompilerConf } from '../types.js';

import { compile } from '../core/compile.js';

export async function makeWebpackConfig(
  options: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
): Promise<Configuration> {
  setMode(['development', 'production'], 'development');
  const result = await compile(options, cb ?? null, true);
  if (result.kind !== 'config') {
    throw new Error('makeWebpackConfig expected a config-only compile');
  }

  return result.webpackConfig;
}
