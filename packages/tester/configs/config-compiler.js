const { getRootRequireDir } = require('@rockpack/utils');
const deepExtend = require('deep-extend');
const { existsSync } = require('node:fs');
const path = require('node:path');
const { isArray } = require('valid-types');

const defaultProps = require('../default-props');
const createTestMatch = require('../modules/create-test-match');

const rootFolder = path.resolve(__dirname, '..');

const currentProjectFolder = getRootRequireDir();

let jestConfig = {};

if (existsSync(path.resolve(currentProjectFolder, './jest.extend.js'))) {
  jestConfig = require(path.resolve(currentProjectFolder, './jest.extend.js'));
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

module.exports = function argsCompiler(opts = {}) {
  const options = deepExtend({}, defaultProps, opts);
  let src = isArray(options.src) ? options.src : [options.src];

  const config = {
    globalSetup,
    globalTeardown,
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': `${rootFolder}/modules/identity-obj-proxy.js`,
    },
    setupFiles,
    setupFilesAfterEnv: [require.resolve('@rockpack/utils/polyfills/text-encoder.fix')].concat(setupFilesAfterEnv),
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/'],
    transform: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${rootFolder}/modules/file-transformer.js`,
      '^.+\\.(js|jsx)$': `${rootFolder}/modules/babel-jest.js`,
      '^.+\\.(ts|tsx)$': `${rootFolder}/modules/babel-jest-ts.js`,
    },
    transformIgnorePatterns: ['node_modules/'],
    ...jestConfig,
  };

  const watch = options.watch || config.watch;
  const noWatch = !watch;

  if (noWatch) {
    config.collectCoverage = true;
    config.coverageReporters = ['json', 'html'];
    config.reporters = [
      'default',
      [
        require.resolve('jest-html-reporters'),
        {
          expand: true,
          filename: 'jest_reporter.html',
          pageTitle: 'Tests Report',
          publicPath: './test-reports',
        },
      ],
    ];
  }

  return {
    ...{
      config: JSON.stringify({ ...config }),
      maxWorkers: 1,
      noCache: noWatch,
      runInBand: noWatch,
      testMatch: createTestMatch(src, options.prefix),
      watch,
    },
  };
};
