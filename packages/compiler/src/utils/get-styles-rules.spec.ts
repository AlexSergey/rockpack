import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getStylesRules } from './get-styles-rules.js';

// The bundled postcss.config.cjs loads these plugins; some of them are ESM-only.
jest.mock('@tailwindcss/postcss', () => jest.fn(() => ({ postcssPlugin: 'tailwindcss' })));
jest.mock('autoprefixer', () => jest.fn(() => ({ postcssPlugin: 'autoprefixer' })));
jest.mock('postcss-custom-media', () => jest.fn(() => ({ postcssPlugin: 'postcss-custom-media' })));
jest.mock('postcss-media-minmax', () => jest.fn(() => ({ postcssPlugin: 'postcss-media-minmax' })));

type LoaderEntry = string | { loader: string; options?: Record<string, unknown> };

const loaderName = (entry: LoaderEntry | undefined): string =>
  typeof entry === 'string' ? entry : (entry?.loader ?? 'missing');

const loaderNames = (chain: LoaderEntry[]): string[] =>
  chain.map((entry) =>
    entry === MiniCssExtractPlugin.loader
      ? 'extract'
      : (['style-loader', 'dts-css-modules-loader', 'postcss-loader', 'css-loader', 'sass-loader', 'less-loader'].find(
          (name) => loaderName(entry).includes(name),
        ) ?? loaderName(entry)),
  );

const findOptions = (chain: LoaderEntry[], name: string): Record<string, unknown> | undefined => {
  const entry = chain.find((item) => loaderNames([item])[0] === name);

  return typeof entry === 'string' ? undefined : entry?.options;
};

describe('getStylesRules', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-compiler-'));
  });

  afterEach(() => {
    rmSync(root, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('injects styles instead of extracting them when styles is false', () => {
      const { css } = getStylesRules({ styles: false }, 'production', root);

      expect(loaderNames(css.simple)[0]).toBe('style-loader');
    });

    it('does not generate css module typings for a JavaScript project', () => {
      const { css } = getStylesRules({}, 'production', root);

      expect(loaderNames(css.module)).not.toContain('dts-css-modules-loader');
    });

    it('disables source maps in production', () => {
      const { scss } = getStylesRules({}, 'production', root);

      expect(findOptions(scss.module, 'css-loader')).toEqual({ modules: true, sourceMap: false });
      expect(findOptions(scss.module, 'sass-loader')).toEqual({ sourceMap: false });
    });
  });

  describe('positive cases', () => {
    it('extracts css, less and scss in production', () => {
      const { css, less, scss } = getStylesRules({}, 'production', root);

      expect(loaderNames(css.simple)).toEqual(['extract', 'css-loader', 'postcss-loader']);
      expect(loaderNames(less.simple)).toEqual(['extract', 'css-loader', 'postcss-loader', 'less-loader']);
      expect(loaderNames(scss.module)).toEqual(['extract', 'css-loader', 'postcss-loader', 'sass-loader']);
      expect(findOptions(css.simple, 'css-loader')).toEqual({ modules: undefined, sourceMap: false });
    });

    it('injects styles with source maps in development', () => {
      const { less } = getStylesRules({}, 'development', root);

      expect(loaderNames(less.module)[0]).toBe('style-loader');
      expect(findOptions(less.module, 'less-loader')).toEqual({
        lessOptions: { javascriptEnabled: true },
        sourceMap: true,
      });
    });

    it('keeps source maps in production debug builds', () => {
      const { css } = getStylesRules({ debug: true }, 'production', root);

      expect(findOptions(css.module, 'postcss-loader')).toMatchObject({ sourceMap: true });
    });

    it('generates css module typings for a TypeScript project', () => {
      writeFileSync(path.join(root, 'tsconfig.json'), '{}');

      const { css, scss } = getStylesRules({}, 'production', root);

      expect(loaderNames(css.module)).toEqual(['extract', 'dts-css-modules-loader', 'css-loader', 'postcss-loader']);
      expect(loaderNames(scss.simple)).not.toContain('dts-css-modules-loader');
    });

    it('extracts styles for isomorphic builds even in development', () => {
      const { css, less, scss } = getStylesRules({ __isIsomorphicStyles: true }, 'development', root);

      [css.module, css.simple, less.module, less.simple, scss.module, scss.simple].forEach((chain) => {
        expect(loaderNames(chain)[0]).toBe('extract');
      });
    });

    it('uses the project postcss.config.js', () => {
      writeFileSync(path.join(root, 'postcss.config.js'), "module.exports = { plugins: ['custom'] };");

      const { css } = getStylesRules({}, 'production', root);

      expect(findOptions(css.simple, 'postcss-loader')).toEqual({
        postcssOptions: { plugins: ['custom'] },
        sourceMap: false,
      });
    });

    it('falls back to the bundled postcss config', () => {
      const { css } = getStylesRules({}, 'production', root);

      expect(findOptions(css.simple, 'postcss-loader')?.['postcssOptions']).toEqual({
        plugins: [
          { postcssPlugin: 'tailwindcss' },
          { postcssPlugin: 'postcss-media-minmax' },
          { postcssPlugin: 'postcss-custom-media' },
          { postcssPlugin: 'autoprefixer' },
        ],
      });
    });
  });
});
