import { createBabelPresets } from '@rockpack/babel';
import { isomorphicCompiler } from '@rockpack/compiler';
import { createRequire } from 'node:module';
import path from 'node:path';

const _require = createRequire(import.meta.url);

void isomorphicCompiler({
  backend: {
    dist: 'dist',
    src: 'src/server.tsx',
  },
  backendCallback: (config, modules) => {
    const preset = createBabelPresets({
      framework: 'react',
      isNodejs: true,
      typescript: true,
    });
    (preset.plugins ??= []).unshift(_require.resolve('@issr/babel-plugin'));

    modules.set('ts', {
      test: /\.ts$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: preset,
      },
    });

    modules.set('tsx', {
      test: /\.tsx$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: preset,
      },
    });
  },
  frontend: {
    copy: [
      { from: path.resolve(import.meta.dirname, './favicon.ico'), to: './' },
      { from: path.resolve(import.meta.dirname, './robots.txt'), to: './' },
    ],
    dist: 'public',
    src: 'src/client.tsx',
  },
  frontendCallback: (config, modules) => {
    const preset = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      typescript: true,
    });
    (preset.plugins ??= []).unshift(_require.resolve('@issr/babel-plugin'));

    modules.set('tsx', {
      test: /\.tsx$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: preset,
      },
    });
    modules.set('ts', {
      test: /\.ts$/,
      use: {
        loader: _require.resolve('babel-loader'),
        options: preset,
      },
    });
  },
});
