const { getRootRequireDir } = require('@rockpack/utils');
const { existsSync } = require('node:fs');
const path = require('node:path');

const { name } = require('../package.json');

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
const root = getRootRequireDir();

module.exports = {
  displayName: `${name}`,
  globalSetup,
  globalTeardown,
  moduleDirectories: [path.resolve(root, 'node_modules'), 'node_modules'],
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
