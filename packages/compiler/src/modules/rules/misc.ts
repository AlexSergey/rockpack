import { createRequire } from 'node:module';

import type { Rules } from './types.js';

const _require = createRequire(import.meta.url);

export const makeMiscRules = (): Rules => ({
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
  markdown: {
    test: /\.md$/,
    use: [_require.resolve('html-loader'), _require.resolve('markdown-loader')],
  },
  node: {
    test: /\.node$/,
    use: _require.resolve('node-loader'),
  },
  shaders: {
    test: /\.(glsl|vs|fs)$/,
    use: _require.resolve('shader-loader'),
  },
  wasm: {
    test: /\.wasm$/,
    use: _require.resolve('wasm-loader'),
  },
});
