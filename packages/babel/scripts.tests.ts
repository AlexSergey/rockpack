import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

tester(
  { src: './src', watch },
  {
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/__fixtures__/**'],
    coverageThreshold: { global: { branches: 85, functions: 90, lines: 90, statements: 90 } },
    testEnvironment: 'node',
  },
);
