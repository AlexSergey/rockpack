import type { PluginItem, TransformOptions } from '@babel/core';

import deepmerge from 'deepmerge';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

export interface CreateBabelPresetsOptions {
  readonly framework?: Framework;
  readonly isNodejs?: boolean;
  readonly isTest?: boolean;
  readonly modules?: Modules;
  readonly presetsAdditionalOptions?: Readonly<Record<string, Record<string, unknown>>>;
  readonly typescript?: boolean;
}

interface BabelMergeContext {
  readonly framework: Framework;
  readonly isNodejs: boolean;
  readonly isTest: boolean;
  readonly modules: Modules;
  readonly typescript: boolean;
}

type BabelMergeFunction = (
  context: BabelMergeContext,
  opts: TransformOptions,
  merge: typeof deepmerge,
) => TransformOptions;

type Framework = 'none' | 'react';

type Modules = 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;

interface PackageJson {
  readonly dependencies?: Readonly<Record<string, string>>;
}

const _require = createRequire(import.meta.url);

export const createBabelPresets = ({
  framework = 'none',
  isNodejs = false,
  isTest = false,
  modules = false,
  presetsAdditionalOptions = {},
  typescript = false,
  // eslint-disable-next-line @sonar/cognitive-complexity
}: CreateBabelPresetsOptions = {}): TransformOptions => {
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const babelMergePath = path.resolve(root, 'rockpack.babel.js');

  let packageJson: PackageJson = {};
  if (existsSync(packageJsonPath)) {
    try {
      packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
    } catch {
      // ignore malformed package.json
    }
  }

  let corejs: false | string = false;
  const coreJsDep = packageJson.dependencies?.['core-js'];
  if (typeof coreJsDep === 'string') {
    corejs = coreJsDep;
  }

  const getPresetAdditionalOptions = (presetName: string): Record<string, unknown> =>
    presetsAdditionalOptions[presetName] ?? {};

  const getPreset = (presetName: string, options: Record<string, unknown> = {}): [string, Record<string, unknown>] => [
    _require.resolve(presetName),
    { ...options, ...getPresetAdditionalOptions(presetName) },
  ];

  const plugins: PluginItem[] = [];

  if (framework === 'react') {
    plugins.push(getPreset('babel-plugin-react-compiler'));
  }

  plugins.push(
    getPreset('@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }),
    getPreset('@babel/plugin-proposal-do-expressions'),
    getPreset('@babel/plugin-proposal-decorators', { legacy: true }),
  );

  if (typescript) {
    plugins.push(_require.resolve('babel-plugin-transform-typescript-metadata'));
  }

  if (isTest) {
    plugins.push(_require.resolve('@babel/plugin-transform-modules-commonjs'));
  }

  const presets: PluginItem[] = typescript
    ? [getPreset('@babel/preset-typescript')]
    : [
        getPreset('@babel/preset-env', {
          modules,
          ...(isNodejs ? { targets: { node: 'current' } } : { targets: { browsers: ['> 5%'] } }),
          ...(typeof corejs === 'string' ? { corejs, useBuiltIns: 'usage' } : {}),
        }),
      ];

  if (framework === 'react') {
    presets.push(
      getPreset('@babel/preset-react', {
        runtime: 'automatic',
        useBuiltIns: true,
      }),
    );
  }

  const productionPlugins: PluginItem[] = [];
  if (framework === 'react') {
    productionPlugins.push(_require.resolve('@babel/plugin-transform-react-constant-elements'));
  }

  let opts: TransformOptions = {
    babelrc: false,
    env: {
      production: productionPlugins.length > 0 ? { plugins: productionPlugins } : {},
    },
    plugins,
    presets,
  };

  if (existsSync(babelMergePath)) {
    try {
      const babelMergeModule = _require(babelMergePath) as BabelMergeFunction | Record<string, unknown>;

      if (
        typeof babelMergeModule === 'object' &&
        babelMergeModule !== null &&
        Object.keys(babelMergeModule).length > 0
      ) {
        opts = deepmerge(opts, babelMergeModule as Partial<TransformOptions>);
      } else if (typeof babelMergeModule === 'function') {
        const result = babelMergeModule({ framework, isNodejs, isTest, modules, typescript }, opts, deepmerge);
        if (typeof result === 'object' && Object.keys(result).length > 0) {
          opts = result;
        }
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error("Rockpack/Babel: can't merge rockpack.babel.js");
    }
  }

  return opts;
};
