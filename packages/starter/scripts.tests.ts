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
      '!src/constants/**',
      '!src/types/**',
    ],
    coverageThreshold: { global: { branches: 91, functions: 98, lines: 97, statements: 97 } },
    testEnvironment: 'node',
  },
);
