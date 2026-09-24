import { createBabelPresets } from '@rockpack/babel';
import { createRequire } from 'node:module';

import type { RuleContext, Rules } from './types.js';

import { createAssetType } from '../../utils/asset-type.js';

const _require = createRequire(import.meta.url);

export const makeAssetRules = ({ conf }: RuleContext): Rules => {
  const assetType = createAssetType();

  return {
    fonts: {
      test: /\.(eot|ttf|woff|woff2)$/,
      ...assetType.fonts,
    },
    images: {
      test: /\.(jpe?g|png|gif|webp)$/i,
      ...assetType.images,
    },
    pdf: {
      test: /\.pdf$/,
      ...assetType.pdf,
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
          options: createBabelPresets({ framework: 'react', isNodejs: !!conf.nodejs }),
        },
        { loader: _require.resolve('@svgr/webpack') },
      ],
    },
    video: {
      test: /\.(mp4|webm|ogg|mp3|avi|mov|wav)$/,
      ...assetType.video,
    },
  };
};
