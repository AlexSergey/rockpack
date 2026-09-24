import { createBabelPresets } from '@rockpack/babel';
import { createRequire } from 'node:module';

import type { RuleContext, Rules } from './types.js';

const _require = createRequire(import.meta.url);

export const makeScriptRules = ({ conf }: RuleContext): Rules => ({
  js: {
    exclude: /(node_modules)/,
    test: /\.js$/,
    use: [
      {
        loader: _require.resolve('babel-loader'),
        options: createBabelPresets({ isNodejs: !!conf.nodejs }),
      },
    ],
  },
  jsx: {
    exclude: /(node_modules)/,
    test: /\.jsx$/,
    use: [
      {
        loader: _require.resolve('babel-loader'),
        options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs }),
      },
    ],
  },
  mdx: {
    exclude: /(node_modules)/,
    test: /\.mdx$/,
    use: [
      {
        loader: _require.resolve('babel-loader'),
        options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs }),
      },
      _require.resolve('@mdx-js/loader'),
    ],
  },
  mjs: {
    include: /node_modules/,
    resolve: { fullySpecified: false },
    test: /\.mjs$/,
    type: 'javascript/auto',
  },
  ts: {
    test: /\.ts$/,
    use: {
      loader: _require.resolve('babel-loader'),
      options: createBabelPresets({ isNodejs: !!conf.nodejs, typescript: true }),
    },
  },
  tsx: {
    test: /\.tsx$/,
    use: {
      loader: _require.resolve('babel-loader'),
      options: createBabelPresets({
        framework: 'react',
        isNodejs: !!conf.nodejs,
        typescript: true,
      }),
    },
  },
});
