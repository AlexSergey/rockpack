import { getMode } from '@rockpack/utils';
import webpack from 'webpack';

import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';
import type { CompileOutcome } from './compile-result.js';

import { createReporter } from '../reporter/reporter.js';
import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { assertValidConf } from '../utils/validate-conf.js';
import { getLegacyIsomorphicContext, standaloneContext } from './compile-context.js';
import { closeCompiler } from './compile-result.js';
import { innerProps } from './inner-props.js';
import { make } from './make.js';
import { run } from './run.js';

type PostFn = Parameters<typeof make>[1];

export const compile = async (
  conf: Partial<InternalCompilerConf>,
  post: null | PostFn,
  withoutRun = false,
  context?: CompileContext,
): Promise<CompileOutcome> => {
  const mode = getMode();
  let merged = await mergeConfWithDefault(conf, mode);
  assertValidConf(merged);
  // Read after the first await: see getLegacyIsomorphicContext.
  const ctx =
    context ??
    (await getLegacyIsomorphicContext()) ??
    standaloneContext(
      withoutRun,
      createReporter({ debug: merged.debug === true, progress: merged.progress !== false }),
    );
  merged = innerProps(merged, mode, ctx);
  const finalConfig = await make(merged, post, ctx);

  if (ctx.configOnly) {
    return { conf: finalConfig.conf, kind: 'config', webpackConfig: finalConfig.webpackConfig };
  }

  const running = run(finalConfig.webpackConfig, mode, webpack as Parameters<typeof run>[2], finalConfig.conf);
  if (mode === 'production') {
    const { stats, success } = await running.finished;

    return { kind: 'build', stats, success };
  }

  return {
    compiler: running.compiler,
    conf: finalConfig.conf,
    kind: 'watch',
    ...(ctx.reporter ? { reporter: ctx.reporter } : {}),
    stop: () => closeCompiler(running.compiler),
    webpackConfig: finalConfig.webpackConfig,
  };
};
