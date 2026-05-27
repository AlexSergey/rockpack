import { tester } from '@rockpack/tester';

tester(
  {},
  {
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    modulePathIgnorePatterns: ['./src/generators/'],
    testEnvironment: 'node',
  },
);
