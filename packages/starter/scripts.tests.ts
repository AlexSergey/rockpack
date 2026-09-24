import { tester } from '@rockpack/tester';

const watch = process.argv.includes('--watch');

tester(
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
    coverageThreshold: { global: { branches: 80, functions: 85, lines: 85, statements: 85 } },
    testEnvironment: 'node',
  },
);
