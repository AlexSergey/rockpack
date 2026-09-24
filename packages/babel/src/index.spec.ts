import type { PluginItem } from '@babel/core';

import { transformSync } from '@babel/core';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runInThisContext } from 'node:vm';

import { createBabelPresets } from './index.js';

type ProjectFiles = {
  readonly babelConfig?: string;
  readonly packageJson?: string;
};

const projectDirs: string[] = [];

const createProject = ({ babelConfig, packageJson }: ProjectFiles = {}): void => {
  const dir = mkdtempSync(path.join(tmpdir(), 'rockpack-babel-'));
  projectDirs.push(dir);

  if (typeof packageJson === 'string') {
    writeFileSync(path.join(dir, 'package.json'), packageJson);
  }
  if (typeof babelConfig === 'string') {
    writeFileSync(path.join(dir, 'rockpack.babel.js'), babelConfig);
  }

  jest.spyOn(process, 'cwd').mockReturnValue(dir);
};

const findItem = (items: null | PluginItem[] | undefined, name: string): PluginItem | undefined =>
  (items ?? []).find((item) => {
    const id: unknown = Array.isArray(item) ? item[0] : item;

    return typeof id === 'string' && id.includes(name);
  });

const getItemOptions = (items: null | PluginItem[] | undefined, name: string): unknown => {
  const item = findItem(items, name);

  return Array.isArray(item) ? item[1] : undefined;
};

const getItemIds = (items: null | PluginItem[] | undefined): unknown[] =>
  (items ?? []).map((item): unknown => (Array.isArray(item) ? item[0] : item));

describe('createBabelPresets', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    projectDirs.splice(0).forEach((dir) => rmSync(dir, { force: true, recursive: true }));
  });

  describe('negative cases', () => {
    it('ignores a malformed package.json', () => {
      createProject({ packageJson: '{ "dependencies": ' });

      const { presets } = createBabelPresets();

      expect(getItemOptions(presets, '@babel/preset-env')).not.toHaveProperty('corejs');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('does not enable core-js when it is only a devDependency', () => {
      createProject({ packageJson: JSON.stringify({ devDependencies: { 'core-js': '3.40.0' } }) });

      const { presets } = createBabelPresets();

      expect(getItemOptions(presets, '@babel/preset-env')).not.toHaveProperty('corejs');
      expect(getItemOptions(presets, '@babel/preset-env')).not.toHaveProperty('useBuiltIns');
    });

    it('logs and returns the defaults when rockpack.babel.js throws', () => {
      createProject();
      const defaults = createBabelPresets();
      createProject({ babelConfig: "throw new Error('broken config');" });

      const opts = createBabelPresets();

      expect(opts).toEqual(defaults);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Rockpack/Babel: can't merge rockpack.babel.js");
    });

    it('logs and returns the defaults when the rockpack.babel.js function returns null', () => {
      createProject();
      const defaults = createBabelPresets();
      createProject({ babelConfig: 'module.exports = () => null;' });

      const opts = createBabelPresets();

      expect(opts).toEqual(defaults);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Rockpack/Babel: can't merge rockpack.babel.js");
    });

    it('does not add test-only transforms outside of test mode', () => {
      createProject();

      const { plugins } = createBabelPresets();

      expect(findItem(plugins, 'babel-plugin-transform-import-meta')).toBeUndefined();
      expect(findItem(plugins, 'plugin-transform-modules-commonjs')).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('returns browser-targeted defaults without a framework', () => {
      createProject();

      const opts = createBabelPresets();

      expect(opts.babelrc).toBe(false);
      expect(getItemIds(opts.presets)).toEqual([expect.stringContaining('@babel/preset-env')]);
      expect(getItemOptions(opts.presets, '@babel/preset-env')).toEqual({
        modules: false,
        targets: { browsers: ['> 5%'] },
      });
      expect(getItemIds(opts.plugins)).toEqual([
        expect.stringContaining('@babel/plugin-proposal-pipeline-operator'),
        expect.stringContaining('@babel/plugin-proposal-do-expressions'),
        expect.stringContaining('@babel/plugin-proposal-decorators'),
      ]);
      expect(getItemOptions(opts.plugins, 'plugin-proposal-pipeline-operator')).toEqual({ proposal: 'minimal' });
      expect(getItemOptions(opts.plugins, 'plugin-proposal-decorators')).toEqual({ legacy: true });
      expect(opts.env).toEqual({ production: {} });
    });

    it('targets the current Node.js version when isNodejs is set', () => {
      createProject();

      const { presets } = createBabelPresets({ isNodejs: true });

      expect(getItemOptions(presets, '@babel/preset-env')).toEqual({ modules: false, targets: { node: 'current' } });
    });

    it('forwards the modules option to preset-env', () => {
      createProject();

      const { presets } = createBabelPresets({ modules: 'commonjs' });

      expect(getItemOptions(presets, '@babel/preset-env')).toHaveProperty('modules', 'commonjs');
    });

    it('enables core-js polyfills when core-js is a dependency', () => {
      createProject({ packageJson: JSON.stringify({ dependencies: { 'core-js': '3.40.0' } }) });

      const { presets } = createBabelPresets();

      expect(getItemOptions(presets, '@babel/preset-env')).toMatchObject({ corejs: '3.40.0', useBuiltIns: 'usage' });
    });

    it('adds the React compiler, preset and production plugins for the react framework', () => {
      createProject();

      const opts = createBabelPresets({ framework: 'react' });

      expect(getItemIds(opts.plugins)[0]).toEqual(expect.stringContaining('babel-plugin-react-compiler'));
      expect(getItemOptions(opts.presets, '@babel/preset-react')).toEqual({ runtime: 'automatic', useBuiltIns: true });
      expect(opts.env).toEqual({
        production: { plugins: [expect.stringContaining('@babel/plugin-transform-react-constant-elements')] },
      });
    });

    it('replaces preset-env with preset-typescript and adds decorator metadata for typescript', () => {
      createProject();

      const { plugins, presets } = createBabelPresets({ typescript: true });

      expect(getItemIds(presets)).toEqual([expect.stringContaining('@babel/preset-typescript')]);
      expect(findItem(plugins, 'babel-plugin-transform-typescript-metadata')).toBeDefined();
    });

    it('transforms import.meta and ES modules in test mode', () => {
      createProject();

      const { plugins } = createBabelPresets({ isTest: true });

      expect(getItemIds(plugins).slice(-3)).toEqual([
        expect.stringContaining('rename-cjs-globals'),
        expect.stringContaining('babel-plugin-transform-import-meta'),
        expect.stringContaining('@babel/plugin-transform-modules-commonjs'),
      ]);
    });

    it('keeps a module-level __filename declared from import.meta.url working in test mode', () => {
      createProject();
      const source = [
        "import { fileURLToPath } from 'node:url';",
        'const __filename = fileURLToPath(import.meta.url);',
        'export const file = __filename;',
      ].join('\n');

      const result = transformSync(source, {
        ...createBabelPresets({ isTest: true }),
        configFile: false,
        filename: '/project/src/module.ts',
      });
      const module = { exports: {} as Record<string, unknown> };
      const run = runInThisContext(`(function (require, module, exports, __filename) {${result?.code ?? ''}\n})`) as (
        ...args: unknown[]
      ) => void;
      run(require, module, module.exports, '/project/src/module.ts');

      expect(module.exports['file']).toBe('/project/src/module.ts');
    });

    it('deep-merges an object exported from rockpack.babel.js', () => {
      createProject({
        babelConfig: "module.exports = { comments: false, plugins: ['custom-plugin'] };",
      });

      const opts = createBabelPresets();

      expect(opts.comments).toBe(false);
      expect(opts.babelrc).toBe(false);
      expect(getItemIds(opts.plugins)).toHaveLength(4);
      expect(getItemIds(opts.plugins)[3]).toBe('custom-plugin');
    });

    it('keeps the defaults when rockpack.babel.js exports an empty object', () => {
      createProject();
      const defaults = createBabelPresets();
      createProject({ babelConfig: 'module.exports = {};' });

      expect(createBabelPresets()).toEqual(defaults);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('replaces the options with the non-empty result of a rockpack.babel.js function', () => {
      createProject({
        babelConfig: [
          'module.exports = (ctx, opts, merge) => ({',
          '  ctx,',
          '  hasDefaults: opts.babelrc === false,',
          "  hasMerge: typeof merge === 'function',",
          '});',
        ].join('\n'),
      });

      const opts = createBabelPresets({ framework: 'react', isTest: true });

      expect(opts as unknown).toEqual({
        ctx: { framework: 'react', isNodejs: false, isTest: true, modules: false, typescript: false },
        hasDefaults: true,
        hasMerge: true,
      });
    });

    it('keeps the defaults when a rockpack.babel.js function returns an empty object', () => {
      createProject();
      const defaults = createBabelPresets();
      createProject({ babelConfig: 'module.exports = () => ({});' });

      expect(createBabelPresets()).toEqual(defaults);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
