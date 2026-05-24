import { setMode } from '@rockpack/utils';
import deepExtend from 'deep-extend';
import { isObject, isString } from 'valid-types';

import type { CompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/library-compiler.js';

type LibraryOpts =
  | string
  | {
      cjs?: { dist: string; src: string };
      esm?: { dist: string; src: string };
      externals?: unknown[];
      name: string;
    };

export async function libraryCompiler(
  libraryOpts: LibraryOpts,
  conf: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
  configOnly = false,
): Promise<ReturnType<typeof compile>> {
  setMode(['development', 'production'], 'development');
  errorHandler();

  let libraryName: string | undefined;
  let mergedConf: Partial<CompilerConf> = { ...conf, __library: true };

  if (isString(libraryOpts)) {
    libraryName = libraryOpts;
  } else if (isObject(libraryOpts) && isString((libraryOpts as { name?: unknown }).name)) {
    const opts = libraryOpts;

    if (Array.isArray(opts.externals) && opts.externals.length > 0) {
      mergedConf.externals = opts.externals;
    }

    libraryName = opts.name;

    if (isObject(opts.esm)) {
      mergedConf = deepExtend({}, mergedConf, { esm: opts.esm });
    }
    if (isObject(opts.cjs)) {
      mergedConf = deepExtend({}, mergedConf, { cjs: opts.cjs });
    }
  } else {
    console.error(errors.LIBRARY_OPTS_ERROR);
    console.error(errors.MUST_BE_STRING);
    process.exit(1);
  }

  if (!isString(libraryName)) {
    console.error(errors.MUST_BE_STRING);
    process.exit(1);
  }

  mergedConf = deepExtend({}, mergedConf, {
    html: mergedConf.html ? mergedConf.html : false,
    library: libraryName,
  });

  mergedConf.name = libraryCompiler.name;
  mergedConf.compilerName = libraryCompiler.name;

  if (mergedConf.nodejs) {
    mergedConf = deepExtend({}, mergedConf, {
      __isBackend: true,
      html: false,
      nodejs: true,
    });
  }

  return compile(mergedConf, cb ?? null, configOnly);
}
