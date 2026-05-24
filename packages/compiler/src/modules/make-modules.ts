import { createBabelPresets } from '@rockpack/babel';
import { createRequire } from 'node:module';

import type { CompilerConf, Mode } from '../types.js';

import { createAssetType } from '../utils/asset-type.js';
import { Collection } from '../utils/collection.js';
import { getStylesRules } from '../utils/get-styles-rules.js';

const _require = createRequire(import.meta.url);

function getModules(conf: Partial<CompilerConf>, mode: Mode, root: string): Record<string, unknown> {
  const { css, less, scss } = getStylesRules(conf, mode, root);
  const presetsAdditionalOptions = conf.babelPresetsAdditionalOptions ?? {};
  const assetType = createAssetType();

  return {
    css: {
      exclude: /\.module\.css$/,
      test: /\.css$/,
      use: css.simple,
    },
    cssModules: {
      test: /\.module\.css$/,
      use: css.module,
    },
    fonts: {
      test: /\.(eot|ttf|woff|woff2)$/,
      ...assetType.fonts,
    },
    geojson: {
      test: /\.geojson$/,
      type: 'json',
    },
    graphql: {
      test: /\.(graphql|gql)$/,
      use: _require.resolve('@graphql-tools/webpack-loader'),
    },
    html: {
      test: /\.html$/,
      use: _require.resolve('html-loader'),
    },
    images: {
      test: /\.(jpe?g|png|gif|webp)$/i,
      ...assetType.images,
    },
    js: {
      exclude: /(node_modules)/,
      test: /\.js$/,
      use: [
        {
          loader: _require.resolve('babel-loader'),
          options: createBabelPresets({ isNodejs: !!conf.nodejs, presetsAdditionalOptions }),
        },
      ],
    },
    jsx: {
      exclude: /(node_modules)/,
      test: /\.jsx$/,
      use: [
        {
          loader: _require.resolve('babel-loader'),
          options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs, presetsAdditionalOptions }),
        },
      ],
    },
    less: {
      exclude: /\.module\.less$/,
      test: /\.less$/,
      use: less.simple,
    },
    lessModules: {
      test: /\.module\.less$/,
      use: less.module,
    },
    markdown: {
      test: /\.md$/,
      use: [_require.resolve('html-loader'), _require.resolve('markdown-loader')],
    },
    mdx: {
      exclude: /(node_modules)/,
      test: /\.mdx$/,
      use: [
        {
          loader: _require.resolve('babel-loader'),
          options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs, presetsAdditionalOptions }),
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
    node: {
      test: /\.node$/,
      use: _require.resolve('node-loader'),
    },
    pdf: {
      test: /\.pdf$/,
      ...assetType.pdf,
    },
    scss: {
      exclude: /\.module\.scss$/,
      test: /\.scss$/,
      use: scss.simple,
    },
    scssModules: {
      test: /\.module\.scss$/,
      use: scss.module,
    },
    shaders: {
      test: /\.(glsl|vs|fs)$/,
      use: _require.resolve('shader-loader'),
    },
    svg: {
      exclude: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: _require.resolve('svgo-loader'),
          options: {
            name: 'preset-default',
            params: {
              overrides: {
                convertColors: { params: { shorthex: false } },
                convertPathData: false,
                removeTitle: true,
              },
            },
          },
        },
      ],
      ...assetType.svg,
    },
    svgJSX: {
      test: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: _require.resolve('babel-loader'),
          options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs, presetsAdditionalOptions }),
        },
        { loader: _require.resolve('@svgr/webpack') },
      ],
    },
    ts: {
      test: /\.ts$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: createBabelPresets({ isNodejs: !!conf.nodejs, presetsAdditionalOptions, typescript: true }),
      },
    },
    tsx: {
      test: /\.tsx$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: createBabelPresets({
          framework: 'react',
          isNodejs: !!conf.nodejs,
          presetsAdditionalOptions,
          typescript: true,
        }),
      },
    },
    video: {
      test: /\.(mp4|webm|ogg|mp3|avi|mov|wav)$/,
      ...assetType.video,
    },
    wasm: {
      test: /\.wasm(\.js)$/,
      use: _require.resolve('wasm-loader'),
    },
  };
}

export const makeModules = (
  conf: Partial<CompilerConf>,
  root: string,
  _packageJson: unknown,
  mode: Mode,
  excludeModules: string[] = [],
): Collection => {
  const modules = getModules(conf, mode, root);

  for (const key of excludeModules) {
    delete modules[key];
  }

  return new Collection({ data: modules, props: {} });
};
