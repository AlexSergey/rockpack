import type { Config } from '@jest/types';

import { createBabelPresets } from '@rockpack/babel';
import { getRootRequireDir } from '@rockpack/utils';
import deepExtend from 'deep-extend';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { TesterOptions } from '../default-props.js';

import { defaultProps } from '../default-props.js';
import { createTestMatch } from '../modules/create-test-match.js';

const _require = createRequire(import.meta.url);

export type CompiledConfig = {
  // The runCLI arguments; `config` in there is the JSON of `config` below.
  readonly argv: Record<string, unknown>;
  readonly config: Config.InitialOptions;
};

// Where the tester runs: the project whose setup files are detected, the tester's own build folder (the modules the
// config points at) and the extension of that build.
export type TesterEnvironment = {
  readonly ext: '.cjs' | '.mjs';
  readonly packageDir: string;
  readonly projectDir: string;
};

const defaultEnvironment = (): TesterEnvironment => ({
  ext: import.meta.url.endsWith('.mjs') ? '.mjs' : '.cjs',
  packageDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  projectDir: getRootRequireDir(),
});

type SetupFiles = {
  globalSetup?: string;
  globalTeardown?: string;
  setupFiles: string[];
  setupFilesAfterEnv: string[];
};

const findSetupFiles = (projectDir: string): SetupFiles => {
  const found: SetupFiles = { setupFiles: [], setupFilesAfterEnv: [] };
  for (const ext of ['.js', '.mjs', '.cjs', '.ts']) {
    if (existsSync(path.resolve(projectDir, `./jest.init${ext}`))) {
      found.setupFiles.push(`<rootDir>/jest.init${ext}`);
    }
    if (existsSync(path.resolve(projectDir, `./jest.setup${ext}`))) {
      found.setupFilesAfterEnv.push(`<rootDir>/jest.setup${ext}`);
    }
    if (existsSync(path.resolve(projectDir, `./jest.global.setup${ext}`))) {
      found.globalSetup = path.resolve(projectDir, `./jest.global.setup${ext}`);
    }
    if (existsSync(path.resolve(projectDir, `./jest.global.teardown${ext}`))) {
      found.globalTeardown = path.resolve(projectDir, `./jest.global.teardown${ext}`);
    }
  }

  return found;
};

// Builds the jest config; nothing is read from disk or the process until it is called.
export const configCompiler = (
  opts: Partial<TesterOptions> = {},
  projectConfig: Partial<Config.InitialOptions> = {},
  environment: Partial<TesterEnvironment> = {},
): CompiledConfig => {
  const { ext, packageDir, projectDir } = { ...defaultEnvironment(), ...environment };
  const { globalSetup, globalTeardown, setupFiles, setupFilesAfterEnv } = findSetupFiles(projectDir);
  const jsPreset = createBabelPresets({ framework: 'react', isTest: true });
  const tsPreset = createBabelPresets({ framework: 'react', isTest: true, typescript: true });
  const options = deepExtend({}, defaultProps, opts) as Required<TesterOptions>;
  const src: string[] = Array.isArray(options.src) ? options.src : [options.src];

  const config = deepExtend(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    {} as Record<string, unknown>,
    {
      globalSetup,
      globalTeardown,
      moduleFileExtensions: ['js', 'jsx', 'mjs', 'cjs', 'json', 'ts', 'tsx'],
      moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': `${packageDir}/modules/identity-obj-proxy${ext}`,
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      setupFiles,
      setupFilesAfterEnv: [_require.resolve('@rockpack/utils/polyfills/text-encoder.fix'), ...setupFilesAfterEnv],
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: ['<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/'],
      transform: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${packageDir}/modules/file-transformer${ext}`,
        '^.+\\.(js|jsx|mjs|cjs)$': [_require.resolve('babel-jest'), jsPreset],
        '^.+\\.(ts|tsx)$': [_require.resolve('babel-jest'), tsPreset],
      },
      transformIgnorePatterns: ['node_modules/'],
    },
    projectConfig,
  ) as Config.InitialOptions;

  const watch = options.watch;
  const noWatch = !watch;
  const serial = options.serial;

  const { coverage } = options;

  if (coverage === false) {
    config.collectCoverage ??= false;
  } else if (noWatch) {
    config.collectCoverage ??= true;
    // Counting every source file, not only the imported ones, keeps the coverage honest.
    const settings = coverage === true ? {} : coverage;
    config.collectCoverageFrom ??= settings.collectCoverageFrom ?? [
      ...src.map((dir) => `${dir.replace(/^\.\//, '')}/**/*.{ts,tsx,js,jsx}`),
      '!**/*.d.ts',
      '!**/*.spec.*',
      '!**/*.test.*',
    ];
    config.coverageReporters ??= settings.reporters ?? ['json', 'html', 'text-summary', 'lcov'];
    if (settings.thresholds) {
      config.coverageThreshold ??= { global: { ...settings.thresholds } };
    }
  }

  if (noWatch) {
    config.reporters ??= [
      'default',
      [
        _require.resolve('jest-html-reporters'),
        {
          expand: true,
          filename: 'jest_reporter.html',
          pageTitle: 'Tests Report',
          publicPath: './test-reports',
        },
      ],
    ];
  }

  const argv = {
    config: JSON.stringify({ ...config }),
    ...(serial ? { maxWorkers: 1 } : {}),
    noCache: serial && noWatch,
    runInBand: serial && noWatch,
    testMatch: createTestMatch(src, options.prefix),
    ...(options.testPathPatterns.length > 0 ? { testPathPatterns: options.testPathPatterns } : {}),
    watch,
  };

  return { argv, config };
};
