import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isBoolean, isString } from 'valid-types';

import type { InternalCompilerConf, Mode } from '../types.js';

import { pathToTsConf } from './path-to-ts-conf.js';

const _require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getPostcssConfig = (root: string): Record<string, unknown> => {
  const pth = existsSync(path.resolve(root, './postcss.config.js'))
    ? path.resolve(root, './postcss.config.js')
    : path.resolve(__dirname, '../configs/postcss.config.cjs');

  return _require(pth) as Record<string, unknown>;
};

type LoaderEntry = string | { loader: string; options?: Record<string, unknown> };
interface StylesRules {
  css: { module: LoaderEntry[]; simple: LoaderEntry[] };
  less: { module: LoaderEntry[]; simple: LoaderEntry[] };
  scss: { module: LoaderEntry[]; simple: LoaderEntry[] };
}

export const getStylesRules = (conf: Partial<InternalCompilerConf>, mode: Mode, root: string): StylesRules => {
  const isProduction = mode === 'production';
  const extractStyles = isProduction ? !(isBoolean(conf.styles) && conf.styles === false) : false;

  const debug = !isProduction || !!conf.debug;
  const tsConfig = pathToTsConf(root, mode, debug);
  const isTypeScript = isString(tsConfig);

  const extractLoader = extractStyles ? MiniCssExtractPlugin.loader : { loader: _require.resolve('style-loader') };

  const cssLoader = (modules: boolean): LoaderEntry => ({
    loader: _require.resolve('css-loader'),
    options: { modules: modules || undefined, sourceMap: debug },
  });

  const postcssLoader: LoaderEntry = {
    loader: _require.resolve('postcss-loader'),
    options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
  };

  const sassLoader: LoaderEntry = { loader: _require.resolve('sass-loader'), options: { sourceMap: debug } };

  const lessLoader: LoaderEntry = {
    loader: _require.resolve('less-loader'),
    options: { lessOptions: { javascriptEnabled: true }, sourceMap: debug },
  };

  const dtsLoader: LoaderEntry = { loader: _require.resolve('dts-css-modules-loader') };

  const isomorphicExtract = MiniCssExtractPlugin.loader;

  const buildChain = (
    base: LoaderEntry,
    withDts: boolean,
    modules: boolean,
    extra: LoaderEntry[] = [],
  ): LoaderEntry[] => {
    const chain: LoaderEntry[] = [base];
    if (withDts) chain.push(dtsLoader);
    chain.push(cssLoader(modules), postcssLoader, ...extra);

    return chain;
  };

  if (conf.__isIsomorphicStyles) {
    return {
      css: {
        module: buildChain(isomorphicExtract, isTypeScript, true),
        simple: buildChain(isomorphicExtract, false, false),
      },
      less: {
        module: buildChain(isomorphicExtract, isTypeScript, true, [lessLoader]),
        simple: buildChain(isomorphicExtract, false, false, [lessLoader]),
      },
      scss: {
        module: buildChain(isomorphicExtract, isTypeScript, true, [sassLoader]),
        simple: buildChain(isomorphicExtract, false, false, [sassLoader]),
      },
    };
  }

  return {
    css: {
      module: buildChain(extractLoader, isTypeScript, true),
      simple: buildChain(extractLoader, false, false),
    },
    less: {
      module: buildChain(extractLoader, isTypeScript, true, [lessLoader]),
      simple: buildChain(extractLoader, false, false, [lessLoader]),
    },
    scss: {
      module: buildChain(extractLoader, isTypeScript, true, [sassLoader]),
      simple: buildChain(extractLoader, false, false, [sassLoader]),
    },
  };
};
