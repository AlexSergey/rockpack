const { existsSync } = require('fs');
const path = require('path');
const { getRootRequireDir } = require('@rockpack/utils');
const { name } = require('../package.json');

const rootFolder = path.resolve(__dirname, '..');

const currentProjectFolder = getRootRequireDir();

let tsConfig = path.resolve(__dirname, 'tsconfig.json');

let jestConfig = {};

if (existsSync(path.resolve(currentProjectFolder, './jest.extend.js'))) {
  // eslint-disable-next-line global-require
  jestConfig = require(path.resolve(currentProjectFolder, './jest.extend.js'));
}

if (existsSync(path.resolve(currentProjectFolder, './tsconfig.js'))) {
  tsConfig = path.resolve(currentProjectFolder, './tsconfig.js');
} else if (existsSync(path.resolve(currentProjectFolder, './tsconfig.json'))) {
  tsConfig = path.resolve(currentProjectFolder, './tsconfig.json');
}

const setupFiles = [];
const setupFilesAfterEnv = [];

if (existsSync(path.resolve(currentProjectFolder, './jest.init.js'))) {
  setupFiles.push('<rootDir>/jest.init.js');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.init.ts'))) {
  setupFiles.push('<rootDir>/jest.init.ts');
}

if (existsSync(path.resolve(currentProjectFolder, './jest.setup.js'))) {
  setupFilesAfterEnv.push('<rootDir>/jest.setup.js');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.setup.ts'))) {
  setupFilesAfterEnv.push('<rootDir>/jest.setup.ts');
}

let globalSetup;
let globalTeardown;

if (existsSync(path.resolve(currentProjectFolder, './jest.global.setup.js'))) {
  globalSetup = path.resolve(currentProjectFolder, './jest.global.setup.js');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.global.setup.ts'))) {
  globalSetup = path.resolve(currentProjectFolder, './jest.global.setup.ts');
}

if (existsSync(path.resolve(currentProjectFolder, './jest.global.teardown.js'))) {
  globalTeardown = path.resolve(currentProjectFolder, './jest.global.teardown.js');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.global.teardown.ts'))) {
  globalTeardown = path.resolve(currentProjectFolder, './jest.global.teardown.ts');
}

module.exports = Object.assign({
  displayName: `${name}`,
  testEnvironment: require.resolve('jest-environment-jsdom'),
  transform: {
    '^.+\\.(ts|tsx)$': `${rootFolder}/modules/babelJestTS.js`,
    '^.+\\.(js|jsx|ts|tsx)$': `${rootFolder}/modules/babelJest.js`,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${rootFolder}/modules/fileTransformer.js`
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': `${rootFolder}/modules/identityObjProxy.js`
  },
  transformIgnorePatterns: [
    'node_modules/'
  ],
  moduleFileExtensions: [
    'js', 'jsx', 'json', 'ts', 'tsx'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/'
  ],
  globalSetup,
  globalTeardown,
  setupFiles,
  setupFilesAfterEnv: [
    require.resolve('jest-extended/all'),
    require.resolve('expect-more-jest'),
    require.resolve('jest-generator'),
    require.resolve('jest-chain'),
    require.resolve('@testing-library/jest-dom/extend-expect')
  ].concat(setupFilesAfterEnv),
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  reporters: [
    'default',
    [require.resolve('jest-html-reporters'), {
      pageTitle: 'Tests Report',
      publicPath: './test-reports',
      filename: 'jest_reporter.html',
      expand: true
    }]
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig
    }
  }
}, jestConfig);
