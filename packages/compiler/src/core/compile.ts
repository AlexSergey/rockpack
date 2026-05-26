import type { Configuration } from 'webpack';

import { getMode } from '@rockpack/utils';
import webpack from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { addArgs } from './args.js';
import { innerProps } from './inner-props.js';
import { make } from './make.js';
import { run } from './run.js';

interface CompileResult {
  conf: InternalCompilerConf;
  webpackConfig: Configuration;
}

type PostFn = Parameters<typeof make>[1];

export const compile = async (
  conf: Partial<InternalCompilerConf>,
  post: null | PostFn,
  withoutRun = false,
): Promise<Awaited<ReturnType<typeof run>> | CompileResult> => {
  const mode = getMode() as Mode;
  let merged = await mergeConfWithDefault(conf, mode);
  merged = innerProps(merged, mode);
  merged = addArgs(merged);
  const finalConfig = await make(merged, post);

  const configOnly = typeof global.CONFIG_ONLY === 'boolean' ? global.CONFIG_ONLY : withoutRun;

  if (configOnly) {
    return {
      conf: finalConfig.conf,
      webpackConfig: finalConfig.webpackConfig,
    };
  }

  return run(finalConfig.webpackConfig, mode, webpack as unknown as Parameters<typeof run>[2], finalConfig.conf);
};
