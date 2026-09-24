import type { TransformOptions } from '@babel/core';

import { transformFileSync } from '@babel/core';
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

export type BuildFormat = 'cjs' | 'esm';

export type BuildOptions = {
  // Folders under src whose non-TypeScript files are copied next to the output (e.g. ['configs']).
  readonly copyDirs?: readonly string[];
  readonly formats?: readonly BuildFormat[];
  // Rewrite import.meta for the CommonJS output; needed when the sources use import.meta.
  readonly importMeta?: boolean;
  readonly root: string;
};

const _require = createRequire(import.meta.url);

const testFilePattern = /\.(?:spec|test)\.tsx?$|(?:^|[/\\])__(?:fixtures|mocks|tests)__[/\\]/;

const extensions: Record<BuildFormat, string> = { cjs: '.cjs', esm: '.mjs' };

const collectFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });

const collectSources = (srcDir: string): string[] =>
  collectFiles(srcDir).filter((file) => {
    if (testFilePattern.test(path.relative(srcDir, file)) || file.endsWith('.d.ts')) {
      return false;
    }
    const ext = path.extname(file);

    return ext === '.ts' || ext === '.tsx';
  });

const babelOptions = (format: BuildFormat, importMeta: boolean): TransformOptions => {
  if (format === 'esm') {
    return {
      babelrc: false,
      configFile: false,
      plugins: [[_require.resolve('babel-plugin-add-import-extension'), { extension: 'mjs' }]],
      presets: [
        [_require.resolve('@babel/preset-env'), { modules: false, targets: { node: 'current' } }],
        [_require.resolve('@babel/preset-typescript')],
      ],
    };
  }

  return {
    babelrc: false,
    configFile: false,
    plugins: [
      [_require.resolve('babel-plugin-add-import-extension'), { extension: 'cjs' }],
      ...(importMeta ? [[_require.resolve('babel-plugin-transform-import-meta')]] : []),
      [_require.resolve('@babel/plugin-transform-modules-commonjs')],
    ],
    presets: [[_require.resolve('@babel/preset-typescript')]],
  };
};

const copyAssets = (srcDir: string, outDir: string, dirs: readonly string[]): void => {
  for (const dir of dirs) {
    const from = path.resolve(srcDir, dir);
    if (!existsSync(from)) {
      continue;
    }
    const to = path.resolve(outDir, dir);
    mkdirSync(to, { recursive: true });
    for (const entry of readdirSync(from, { withFileTypes: true })) {
      if (!entry.isDirectory() && !/\.tsx?$/.test(entry.name)) {
        copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
      }
    }
  }
};

// Compiles src/**/*.ts(x) (without specs and fixtures) to lib/esm/*.mjs and lib/cjs/*.cjs.
export const buildPackage = ({ copyDirs = [], formats = ['esm', 'cjs'], importMeta = false, root }: BuildOptions): void => {
  const srcDir = path.resolve(root, 'src');
  const sources = collectSources(srcDir);

  for (const format of formats) {
    const outDir = path.resolve(root, 'lib', format);
    const options = babelOptions(format, importMeta);

    for (const file of sources) {
      const result = transformFileSync(file, options);
      const outFile = path.join(outDir, path.relative(srcDir, file).replace(/\.tsx?$/, extensions[format]));
      mkdirSync(path.dirname(outFile), { recursive: true });
      writeFileSync(outFile, result?.code ?? '');
    }
    copyAssets(srcDir, outDir, copyDirs);

    console.log(`${format.toUpperCase()}: built ${sources.length} file(s) → ${outDir}`);
  }
};
