import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

void tester(
  { src: './src', watch },
  {
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/**/*.spec.ts',
      '!src/__fixtures__/**',
      '!src/types.ts',
    ],
    coverageThreshold: { global: { branches: 92, functions: 98, lines: 96, statements: 96 } },
    testEnvironment: 'node',
  },
);
