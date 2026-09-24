import { tester } from '@rockpack/tester';

void tester(
  // Generated projects share ports and folders, so the suites must not run in parallel.
  { serial: true },
  {
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/.out/'],
    testEnvironment: 'node',
  },
);
