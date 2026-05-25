const { tester } = require('@rockpack/tester');

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
