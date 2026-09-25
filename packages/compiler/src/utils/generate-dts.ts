import { getMode, isString } from '@rockpack/utils';
import { existsSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

import type { CompilerConf } from '../types.js';

import { testFilesIgnore } from '../constants.js';
import { makeResolve } from '../modules/make-resolve.js';
import { getTypeScript } from './file-system-utils.js';
import { makeCompilerOptions } from './make-compiler-options.js';
import { pathToTsConf } from './path-to-ts-conf.js';

// The folder of the entry file: `src` itself when it has an extension, otherwise the first `src<ext>` that exists.
const findSourceDir = (src: string, extensions: readonly string[]): string | undefined => {
  if (path.extname(src)) {
    return path.dirname(src);
  }
  const index = extensions.map((ext) => `${src}${ext}`).find((file) => existsSync(file));

  return index === undefined ? undefined : path.dirname(index);
};

// Declarations only, straight into the types folder.
const emitDeclarations = (root: string, tsConfig: string, files: string[], outDir: string): void => {
  const { options } = makeCompilerOptions(root, tsConfig, outDir);
  const program = ts.createProgram(files, options, ts.createCompilerHost(options));
  program.emit();
};

// Resolves to the folder the declarations went to, or undefined when there was nothing to declare.
export async function generateDts(conf: Partial<CompilerConf>, root: string): Promise<string | undefined> {
  const tsConfig = pathToTsConf(root, getMode(), false);
  if (!isString(tsConfig)) {
    return undefined;
  }

  const baseDir = findSourceDir(path.join(root, conf.src ?? 'src/index'), makeResolve(root).extensions);
  const files = baseDir === undefined ? [] : await getTypeScript(baseDir, conf.ignore ?? testFilesIgnore);
  if (files.length === 0) {
    return undefined;
  }
  if (!existsSync(tsConfig)) {
    throw new Error('tsconfig not found');
  }

  const types = path.join(root, conf.types ?? path.join(path.dirname(conf.dist ?? 'dist/index.js'), 'types'));
  emitDeclarations(root, tsConfig, files, types);

  return path.relative(root, types);
}
