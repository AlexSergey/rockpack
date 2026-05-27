import { tester } from '@rockpack/tester';

tester(
  {},
  {
    modulePathIgnorePatterns: ['./src/generators/'],
    testEnvironment: 'node',
  },
);
