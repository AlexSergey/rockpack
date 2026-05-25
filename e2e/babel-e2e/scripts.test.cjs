const { tester } = require('@rockpack/tester');

tester(
  {},
  {
    modulePathIgnorePatterns: ['./src/generators/'],
    testEnvironment: 'node',
  },
);
