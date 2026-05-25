const { createBabelPresets } = require('@rockpack/babel');
const { tester } = require('@rockpack/tester');

const preset = createBabelPresets({
  framework: 'react',
  isNodejs: true,
  isTest: true,
  typescript: true,
});

preset.plugins.unshift(require.resolve('@issr/babel-plugin'));

tester(
  {},
  {
    transform: {
      '^.+\\.(ts|tsx)$': ['babel-jest', preset],
    },
  },
);
