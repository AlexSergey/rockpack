import type { Config } from '@jest/types';

import { getRootRequireDir } from '@rockpack/utils';
import deepExtend from 'deep-extend';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { TesterOptions } from '../default-props.js';

import { defaultProps } from '../default-props.js';
import { createTestMatch } from '../modules/create-test-match.js';

const rootFolder = path.resolve(__dirname, '..');
const currentProjectFolder = getRootRequireDir();
const ext = import.meta.url.endsWith('.mjs') ? '.mjs' : '.cjs';

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

export const configCompiler = (
  opts: TesterOptions = {},
  projectConfig: Config.ProjectConfig,
): Record<string, unknown> => {
  const options = deepExtend({} as Required<TesterOptions>, defaultProps, opts);
  const src: string[] = Array.isArray(options.src) ? options.src : [options.src];

  const config = deepExtend(
    {},
    {
      globalSetup,
      globalTeardown,
      moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
      moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': `${rootFolder}/modules/identity-obj-proxy${ext}`,
      },
      setupFiles,
      setupFilesAfterEnv: [require.resolve('@rockpack/utils/polyfills/text-encoder.fix'), ...setupFilesAfterEnv],
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: ['<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/'],
      transform: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${rootFolder}/modules/file-transformer${ext}`,
        '^.+\\.(js|jsx)$': `${rootFolder}/modules/babel-jest${ext}`,
        '^.+\\.(ts|tsx)$': `${rootFolder}/modules/babel-jest-ts${ext}`,
      },
      transformIgnorePatterns: ['node_modules/'],
    },
    projectConfig,
  ) as Config.ProjectConfig;

  const watch = options.watch || opts['watch'];
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
