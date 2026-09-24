import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

tester(
  { src: './src', watch },
  {
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/__fixtures__/**'],
    coverageThreshold: { global: { branches: 90, functions: 95, lines: 95, statements: 95 } },
    testEnvironment: 'node',
  },
);
