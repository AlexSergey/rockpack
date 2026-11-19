import { isRecord, isString, setMode } from '@rockpack/utils';
import deepExtend from 'deep-extend';

import type { CompilerResult } from '../core/compile-result.js';
import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/library-compiler.js';
import { withErrorBoundary } from './error-boundary.js';

export type LibraryCompilerOptions = {
  readonly cjs?: { dist: string; src: string };
  readonly esm?: { dist: string; src: string };
  readonly externals?: unknown[];
  // The global the UMD bundle exposes.
  readonly name: string;
};

type PostFn = Parameters<typeof compile>[1];

export async function libraryCompiler(
  libraryOpts: LibraryCompilerOptions,
  conf: Partial<CompilerConf> = {},
  cb?: PostFn,
  configOnly = false,
): Promise<CompilerResult> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();

    let libraryName: string;
    let mergedConf: Partial<InternalCompilerConf> = { ...conf, __library: true };

    if (isRecord(libraryOpts) && isString((libraryOpts as { name?: unknown }).name)) {
      const opts = libraryOpts;

      if (Array.isArray(opts.externals) && opts.externals.length > 0) {
        mergedConf.externals = opts.externals;
      }

      libraryName = opts.name;

      if (isRecord(opts.esm)) {
        mergedConf = deepExtend({}, mergedConf, { esm: opts.esm });
      }
      if (isRecord(opts.cjs)) {
        mergedConf = deepExtend({}, mergedConf, { cjs: opts.cjs });
      }
    } else {
      throw errors.invalidLibraryOptions();
    }

    mergedConf = deepExtend({}, mergedConf, {
      html: mergedConf.html ?? false,
      library: libraryName,
    });

    mergedConf.name = 'libraryCompiler';
    mergedConf.compilerName = 'libraryCompiler';

    if (mergedConf.nodejs) {
      mergedConf = deepExtend({}, mergedConf, {
        __isBackend: true,
        html: false,
        nodejs: true,
      });
    }

    return compile(mergedConf, cb ?? null, configOnly);
  });
}
