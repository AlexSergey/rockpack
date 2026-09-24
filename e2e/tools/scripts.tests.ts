import { tester } from '@rockpack/tester';

void tester(
  { src: './src' },
  {
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/browser.ts', '!src/pack.ts'],
    testEnvironment: 'node',
  },
);
