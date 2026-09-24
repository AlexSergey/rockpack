import { getMode, isString } from '@rockpack/utils';
import { mkdirp } from 'mkdirp';
import { copyFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { rimraf } from 'rimraf';
import ts from 'typescript';

import type { CompilerConf } from '../types.js';

import { moduleFormats, testFilesIgnore } from '../constants.js';
import { makeResolve } from '../modules/make-resolve.js';
import { getFiles, getTypeScript } from './file-system-utils.js';
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

const emitDeclarations = async (root: string, tsConfig: string, files: string[], outDir: string): Promise<string[]> => {
  const compilerOptions = makeCompilerOptions(root, tsConfig, outDir, moduleFormats.cjs);
  const options = { ...compilerOptions.options, declaration: true, noEmit: false };
  const program = ts.createProgram(files, options, ts.createCompilerHost(options));
  program.getTypeChecker();
  program.emit();

  return getFiles(outDir, '**/*.d.ts');
};

const copyDeclarations = (files: readonly string[], from: string, to: string): void => {
  for (const file of files) {
    const fileDest = path.join(to, path.relative(from, file));
    mkdirp.sync(path.dirname(fileDest));
    copyFileSync(file, fileDest);
  }
};

export async function generateDts(conf: Partial<CompilerConf>, root: string): Promise<void> {
  const tsConfig = pathToTsConf(root, getMode(), false);
  if (!isString(tsConfig)) {
    console.error("It's not TS project");

    return;
  }

  const baseDir = findSourceDir(path.join(root, conf.src ?? 'src/index'), makeResolve(root).extensions);
  const files = baseDir === undefined ? [] : await getTypeScript(baseDir, conf.ignore ?? testFilesIgnore);
  if (files.length === 0) {
    return;
  }
  if (!existsSync(tsConfig)) {
    throw new Error('tsconfig not found');
  }

  const temp = mkdtempSync(path.join(tmpdir(), 'rockpack-dts-'));
  try {
    const dts = await emitDeclarations(root, tsConfig, files, temp);
    const dist = path.join(root, conf.types ?? path.join(path.dirname(conf.dist ?? 'dist/index.js'), 'types'));
    copyDeclarations(dts, temp, dist);
  } finally {
    await rimraf(temp);
  }
}
