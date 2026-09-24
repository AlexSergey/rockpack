import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

tester(
  { src: './src', watch },
  {
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/__fixtures__/**'],
    coverageThreshold: { global: { branches: 98, functions: 98, lines: 98, statements: 98 } },
    testEnvironment: 'node',
  },
);
