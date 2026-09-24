import type { Configuration } from 'webpack';

import { getMode } from '@rockpack/utils';
import webpack from 'webpack';

import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { addArgs } from './args.js';
import { getLegacyIsomorphicContext, standaloneContext } from './compile-context.js';
import { innerProps } from './inner-props.js';
import { make } from './make.js';
import { run } from './run.js';

type CompileResult = {
  conf: InternalCompilerConf;
  webpackConfig: Configuration;
};

type PostFn = Parameters<typeof make>[1];

export const compile = async (
  conf: Partial<InternalCompilerConf>,
  post: null | PostFn,
  withoutRun = false,
  context?: CompileContext,
): Promise<Awaited<ReturnType<typeof run>> | CompileResult> => {
  const mode = getMode();
  let merged = await mergeConfWithDefault(conf, mode);
  // Read after the first await: see getLegacyIsomorphicContext.
  const ctx = context ?? getLegacyIsomorphicContext() ?? standaloneContext(withoutRun);
  merged = innerProps(merged, mode, ctx);
  merged = addArgs(merged, ctx);
  const finalConfig = await make(merged, post, ctx);

  if (ctx.configOnly) {
    return {
      conf: finalConfig.conf,
      webpackConfig: finalConfig.webpackConfig,
    };
  }

  return run(finalConfig.webpackConfig, mode, webpack as Parameters<typeof run>[2], finalConfig.conf);
};
