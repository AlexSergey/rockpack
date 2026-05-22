import deepmerge from 'deepmerge';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
export const createBabelPresetsWithRequire = (_require, {
  framework = 'none',
  isNodejs = false,
  isTest = false,
  modules = false,
  presetsAdditionalOptions = {},
  typescript = false
}
// eslint-disable-next-line @sonar/cognitive-complexity
) => {
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const babelMergePath = path.resolve(root, 'rockpack.babel.js');
  let packageJson = {};
  if (existsSync(packageJsonPath)) {
    try {
      packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    } catch {
      // ignore malformed package.json
    }
  }
  let corejs = false;
  const coreJsDep = packageJson.dependencies?.['core-js'];
  if (typeof coreJsDep === 'string') {
    corejs = coreJsDep;
  }
  const getPresetAdditionalOptions = presetName => presetsAdditionalOptions[presetName] ?? {};
  const getPreset = (presetName, options = {}) => [_require.resolve(presetName), {
    ...options,
    ...getPresetAdditionalOptions(presetName)
  }];
  const plugins = [];
  if (framework === 'react') {
    plugins.push(getPreset('babel-plugin-react-compiler'));
  }
  plugins.push(getPreset('@babel/plugin-proposal-pipeline-operator', {
    proposal: 'minimal'
  }), getPreset('@babel/plugin-proposal-do-expressions'), getPreset('@babel/plugin-proposal-decorators', {
    legacy: true
  }));
  if (typescript) {
    plugins.push(_require.resolve('babel-plugin-transform-typescript-metadata'));
  }
  if (isTest) {
    plugins.push(_require.resolve('@babel/plugin-transform-modules-commonjs'));
  }
  const presets = typescript ? [getPreset('@babel/preset-typescript')] : [getPreset('@babel/preset-env', {
    modules,
    ...(isNodejs ? {
      targets: {
        node: 'current'
      }
    } : {
      targets: {
        browsers: ['> 5%']
      }
    }),
    ...(typeof corejs === 'string' ? {
      corejs,
      useBuiltIns: 'usage'
    } : {})
  })];
  if (framework === 'react') {
    presets.push(getPreset('@babel/preset-react', {
      runtime: 'automatic',
      useBuiltIns: true
    }));
  }
  const productionPlugins = [];
  if (framework === 'react') {
    productionPlugins.push(_require.resolve('@babel/plugin-transform-react-constant-elements'));
  }
  let opts = {
    babelrc: false,
    env: {
      production: productionPlugins.length > 0 ? {
        plugins: productionPlugins
      } : {}
    },
    plugins,
    presets
  };
  if (existsSync(babelMergePath)) {
    try {
      const babelMergeModule = _require(babelMergePath);
      if (typeof babelMergeModule === 'object' && babelMergeModule !== null && Object.keys(babelMergeModule).length > 0) {
        opts = deepmerge(opts, babelMergeModule);
      } else if (typeof babelMergeModule === 'function') {
        const result = babelMergeModule({
          framework,
          isNodejs,
          isTest,
          modules,
          typescript
        }, opts, deepmerge);
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