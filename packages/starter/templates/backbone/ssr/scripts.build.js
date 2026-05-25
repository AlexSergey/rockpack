const { createBabelPresets } = require('@rockpack/babel');
const { backendCompiler, frontendCompiler, isomorphicCompiler } = require('@rockpack/compiler');
const path = require('node:path');

isomorphicCompiler(
  frontendCompiler(
    {
      copy: [
        { from: path.resolve(__dirname, './favicon.ico'), to: './' },
        { from: path.resolve(__dirname, './robots.txt'), to: './' },
      ],
      dist: 'public',
      src: 'src/client.tsx',
    },
    (config, modules) => {
      const preset = createBabelPresets({
        framework: 'react',
        isNodejs: false,
        typescript: true,
      });
      preset.plugins.unshift(require.resolve('@issr/babel-plugin'));

      modules.set('tsx', {
        test: /\.tsx$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: preset,
        },
      });
      modules.set('ts', {
        test: /\.ts$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: preset,
        },
      });
    },
  ),
  backendCompiler(
    {
      dist: 'dist',
      src: 'src/server.tsx',
    },
    (config, modules) => {
      const preset = createBabelPresets({
        framework: 'react',
        isNodejs: true,
        typescript: true,
      });
      preset.plugins.unshift(require.resolve('@issr/babel-plugin'));

      modules.set('ts', {
        test: /\.ts$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: preset,
        },
      });

      modules.set('tsx', {
        test: /\.tsx$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: preset,
        },
      });
    },
  ),
);
