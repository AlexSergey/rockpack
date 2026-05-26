import type { Config } from '@jest/types';

import { createBabelPresets } from '@rockpack/babel';
import { getRootRequireDir } from '@rockpack/utils';
import deepExtend from 'deep-extend';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { TesterOptions } from '../default-props.js';

import { defaultProps } from '../default-props.js';
import { createTestMatch } from '../modules/create-test-match.js';

const _require = createRequire(import.meta.url);

const rootFolder = path.resolve(__dirname, '..');
const currentProjectFolder = getRootRequireDir();
const ext = import.meta.url.endsWith('.mjs') ? '.mjs' : '.cjs';

const setupFiles: string[] = [];
const setupFilesAfterEnv: string[] = [];
let globalSetup: string | undefined;
let globalTeardown: string | undefined;

for (const ext of ['.js', '.mjs', '.cjs', '.ts']) {
  if (existsSync(path.resolve(currentProjectFolder, `./jest.init${ext}`))) {
    setupFiles.push(`<rootDir>/jest.init${ext}`);
  }
  if (existsSync(path.resolve(currentProjectFolder, `./jest.setup${ext}`))) {
    setupFilesAfterEnv.push(`<rootDir>/jest.setup${ext}`);
  }
  if (existsSync(path.resolve(currentProjectFolder, `./jest.global.setup${ext}`))) {
    globalSetup = path.resolve(currentProjectFolder, `./jest.global.setup${ext}`);
  }
  if (existsSync(path.resolve(currentProjectFolder, `./jest.global.teardown${ext}`))) {
    globalTeardown = path.resolve(currentProjectFolder, `./jest.global.teardown${ext}`);
  }
}

const jsPreset = createBabelPresets({
  framework: 'react',
  isTest: true,
});

const tsPreset = createBabelPresets({
  framework: 'react',
  isTest: true,
  typescript: true,
});

export const configCompiler = (
  opts: Partial<TesterOptions> = {},
  projectConfig: Partial<Config.InitialOptions> = {},
): Record<string, unknown> => {
  const options = deepExtend({}, defaultProps, opts) as Required<TesterOptions>;
  const src: string[] = Array.isArray(options.src) ? options.src : [options.src];

  const config = deepExtend(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    {} as Record<string, unknown>,
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
        '^.+\\.(js|jsx)$': [_require.resolve('babel-jest'), jsPreset],
        '^.+\\.(ts|tsx)$': [_require.resolve('babel-jest'), tsPreset],
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
