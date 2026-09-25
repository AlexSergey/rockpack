import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

// The specs run as ES modules: @babel/core 8 is ESM only and Jest's CommonJS sandbox cannot require it.
void tester(
  { esm: true, src: './src', watch },
  {
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/__fixtures__/**'],
    coverageThreshold: { global: { branches: 98, functions: 98, lines: 98, statements: 98 } },
    testEnvironment: 'node',
  },
);
