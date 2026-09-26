import { createBabelPresets } from '@rockpack/babel';
import { tester } from '@rockpack/tester';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);
// babel-jest is a dependency of @rockpack/tester, not of the project: resolve it from there.
const babelJest = createRequire(_require.resolve('@rockpack/tester')).resolve('babel-jest');

const preset = createBabelPresets({
  framework: 'react',
  isNodejs: true,
  isTest: true,
  typescript: true,
});

(preset.plugins ??= []).unshift(_require.resolve('@issr/babel-plugin'));

void tester(
  {},
  {
    transform: {
      '^.+\\.(ts|tsx)$': [babelJest, preset],
    },
  },
);
