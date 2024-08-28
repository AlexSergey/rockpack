const formatter = require('@becklyn/typescript-error-formatter');
const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-cssresources/register',
  ],
  stories: ['./pages/Welcome.js', '../src/**/*.stories.(tsx|jsx)'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.modules\.scss$/,
      use: [
        { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true } },
        { loader: require.resolve('sass-loader') },
      ],
    });

    config.module.rules.push({
      exclude: /\.modules\.scss$/,
      test: /\.scss$/,
      use: [
        { loader: require.resolve('style-loader') },
        { loader: require.resolve('css-loader') },
        { loader: require.resolve('sass-loader') },
      ],
    });

    config.module.rules.push({
      include: path.resolve(__dirname, '../src'),
      test: /\.ts$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
            onlyCompileBundledFiles: true,
          },
        },
      ],
    });

    config.module.rules.push({
      include: path.resolve(__dirname, '../src'),
      test: /\.tsx$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
            onlyCompileBundledFiles: true,
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
          options: {
            tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
      ],
    });

    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

    return config;
  },
};
