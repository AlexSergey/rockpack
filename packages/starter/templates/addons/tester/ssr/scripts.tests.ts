import { createBabelPresets } from '@rockpack/babel';
import { tester } from '@rockpack/tester';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

const preset = createBabelPresets({
  framework: 'react',
  isNodejs: true,
  isTest: true,
  typescript: true,
});

preset.plugins!.unshift(_require.resolve('@issr/babel-plugin'));

tester(
  {},
  {
    transform: {
      '^.+\\.(ts|tsx)$': ['babel-jest', preset],
    },
  },
);
