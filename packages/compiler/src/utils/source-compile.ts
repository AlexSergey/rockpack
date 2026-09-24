import type { TransformOptions } from '@babel/core';

import * as babel from '@babel/core';
import { createBabelPresets } from '@rockpack/babel';
import { getMode, getRootRequireDir, isRecord, isString } from '@rockpack/utils';
import { cpSync, existsSync, renameSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { rimraf } from 'rimraf';

import type { InternalCompilerConf } from '../types.js';

import { testFilesIgnore } from '../constants.js';
import { getFiles, getTypeScript, writeFile } from './file-system-utils.js';
import { pathToTsConf } from './path-to-ts-conf.js';

type Format = 'cjs' | 'esm';

type FormatPaths = {
  readonly dist: string;
  readonly src: string;
};

const FORMATS: readonly Format[] = ['cjs', 'esm'];

const EXTENSIONS: Readonly<Record<Format, string>> = { cjs: '.cjs', esm: '.mjs' };

const _require = createRequire(import.meta.url);

// The formats with both a string src and dist; a format missing either is skipped, never built into the root.
const resolveFormats = (conf: Partial<InternalCompilerConf>): [Format, FormatPaths][] => {
  const formats = FORMATS.flatMap((format): [Format, FormatPaths][] => {
    const formatConf: unknown = conf[format];
    if (isRecord(formatConf) && isString(formatConf['src']) && isString(formatConf['dist'])) {
      return [[format, { dist: formatConf['dist'], src: formatConf['src'] }]];
    }

    return [];
  });
  if (formats.length === 0) {
    throw new Error(`${FORMATS.join(', ')} fields are not object`);
  }

  return formats;
};

const babelOptionsFor = (
  format: Format,
  conf: Partial<InternalCompilerConf>,
  typescript: boolean,
): TransformOptions => {
  const options = createBabelPresets({
    framework: 'react',
    isNodejs: !!conf.nodejs,
    modules: format === 'esm' ? false : 'commonjs',
    typescript,
  });
  const importExtension = [
    _require.resolve('babel-plugin-add-import-extension'),
    { extension: EXTENSIONS[format].slice(1) },
  ];
  options.plugins =
    format === 'esm'
      ? [importExtension, ...(options.plugins ?? [])]
      : [importExtension, _require.resolve('@babel/plugin-transform-modules-commonjs'), ...(options.plugins ?? [])];

  return options;
};

const transpileFile = (file: string, src: string, dist: string, format: Format, options: TransformOptions): void => {
  const result = babel.transformFileSync(file, options);
  if (!result?.code) {
    return;
  }
  const relativePath = path.relative(src, file);
  const outputPath = `${relativePath.substring(0, relativePath.lastIndexOf('.'))}${EXTENSIONS[format]}`;
  writeFile(path.join(dist, outputPath), result.code);
};

const copyAssets = (files: readonly string[], src: string, dist: string): void => {
  console.log('Files will copy:\n');
  console.log(files.join('\n'));
  console.log('\n');
  for (const file of files) {
    try {
      cpSync(file, path.join(dist, path.relative(src, file)), { recursive: true });
    } catch (err) {
      console.error(err);
    }
  }
};

// Files another step left as .js/.js.map get the extension of their format.
const renameOutputs = async (dist: string, format: Format): Promise<void> => {
  const ext = EXTENSIONS[format];
  for (const file of await getFiles(dist, '*.js')) {
    renameSync(file, file.substring(0, file.lastIndexOf('.')) + ext);
  }
  for (const file of await getFiles(dist, '*.js.map')) {
    renameSync(file, `${file.substring(0, file.lastIndexOf('.js.map'))}${ext}.map`);
  }
};

const compileFormat = async (
  format: Format,
  paths: FormatPaths,
  conf: Partial<InternalCompilerConf>,
  tsConfig: false | string,
): Promise<void> => {
  const root = getRootRequireDir();
  const dist = path.join(root, paths.dist);
  const src = path.join(root, paths.src);

  const tsAndTsx = await getTypeScript(paths.src, testFilesIgnore);
  const copyFiles = await getFiles(paths.src, undefined, [
    ...testFilesIgnore,
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
  ]);
  const jsAndJsx = await getFiles(paths.src, '*.+(js|jsx)', testFilesIgnore);

  rimraf.sync(dist);
  console.log(`=========${format} format is starting=========`);

  const isTs = tsAndTsx.length > 0;
  const sourceFiles = isTs ? tsAndTsx : jsAndJsx;
  if (sourceFiles.length > 0) {
    if (isTs && (!isString(tsConfig) || !existsSync(tsConfig))) {
      throw new Error('tsconfig not found');
    }
    const options = babelOptionsFor(format, conf, isTs);
    console.log('Babel convert:\n');
    console.log(sourceFiles.join('\n'));
    console.log('\n');
    for (const file of sourceFiles) {
      transpileFile(file, src, dist, format, options);
    }
  }

  if (copyFiles.length > 0) {
    copyAssets(copyFiles, src, dist);
  }
  await renameOutputs(dist, format);
  console.log(`=========${format} format finished=========`);
};

export async function sourceCompile(conf: Partial<InternalCompilerConf>): Promise<void> {
  const mode = getMode();
  console.log('=========Source compile is starting....=========');

  const formats = resolveFormats(conf);
  const tsConfig = pathToTsConf(getRootRequireDir(), mode, mode === 'development' || !!conf.debug);
  for (const [format, paths] of formats) {
    await compileFormat(format, paths, conf, tsConfig);
  }
}
