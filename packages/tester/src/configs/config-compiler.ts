import { getRootRequireDir } from '@rockpack/utils';
import deepExtend from 'deep-extend';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { TesterOptions } from '../default-props';

import { defaultProps } from '../default-props';
import { createTestMatch } from '../modules/create-test-match';

const rootFolder = path.resolve(__dirname, '..');
const currentProjectFolder = getRootRequireDir();

let jestConfig: Record<string, unknown> = {};

for (const ext of ['cjs', 'js'] as const) {
  const configPath = path.resolve(currentProjectFolder, `./jest.extend.${ext}`);
  if (existsSync(configPath)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jestConfig = require(configPath) as Record<string, unknown>;
  }
}

const setupFiles: string[] = [];
const setupFilesAfterEnv: string[] = [];

if (existsSync(path.resolve(currentProjectFolder, './jest.init.js'))) {
  setupFiles.push('<rootDir>/jest.init.js');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.init.ts'))) {
  setupFiles.push('<rootDir>/jest.init.ts');
}

if (existsSync(path.resolve(currentProjectFolder, './jest.setup.cjs'))) {
  setupFilesAfterEnv.push('<rootDir>/jest.setup.cjs');
} else if (existsSync(path.resolve(currentProjectFolder, './jest.setup.ts'))) {
  setupFilesAfterEnv.push('<rootDir>/jest.setup.ts');
}

let globalSetup: string | undefined;
let globalTeardown: string | undefined;

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

export const configCompiler = (opts: TesterOptions = {}): Record<string, unknown> => {
  const options = deepExtend({} as Required<TesterOptions>, defaultProps, opts);
  const src: string[] = Array.isArray(options.src) ? options.src : [options.src];

  const config: Record<string, unknown> = {
    globalSetup,
    globalTeardown,
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': `${rootFolder}/modules/identity-obj-proxy.cjs`,
    },
    setupFiles,
    setupFilesAfterEnv: [require.resolve('@rockpack/utils/polyfills/text-encoder.fix'), ...setupFilesAfterEnv],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/'],
    transform: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${rootFolder}/modules/file-transformer.cjs`,
      '^.+\\.(js|jsx)$': `${rootFolder}/modules/babel-jest.cjs`,
      '^.+\\.(ts|tsx)$': `${rootFolder}/modules/babel-jest-ts.cjs`,
    },
    transformIgnorePatterns: ['node_modules/'],
    ...jestConfig,
  };

  const watch = options.watch || (config['watch'] as boolean | undefined);
  const noWatch = !watch;

  if (noWatch) {
    config['collectCoverage'] = true;
    config['coverageReporters'] = ['json', 'html'];
    config['reporters'] = [
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
    config: JSON.stringify({ ...config }),
    maxWorkers: 1,
    noCache: noWatch,
    runInBand: noWatch,
    testMatch: createTestMatch(src, options.prefix),
    watch,
  };
};
