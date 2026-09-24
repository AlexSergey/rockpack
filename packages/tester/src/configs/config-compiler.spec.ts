import type { Config } from '@jest/types';

import { configCompiler } from './config-compiler.js';

const mockProjectDir = '/project';
const mockExistingFiles = new Set<string>();

jest.mock('node:fs', () => ({
  existsSync: jest.fn((file: string): boolean => mockExistingFiles.has(file)),
}));
jest.mock('@rockpack/utils', () => ({ getRootRequireDir: (): string => mockProjectDir }));
jest.mock('@rockpack/babel', () => ({
  createBabelPresets: (opts: Record<string, unknown>): Record<string, unknown> => ({ presetFor: opts }),
}));

const compile = (
  opts?: Parameters<typeof configCompiler>[0],
  projectConfig?: Parameters<typeof configCompiler>[1],
): Record<string, unknown> => configCompiler(opts, projectConfig, { projectDir: mockProjectDir }).argv;

const parseConfig = (compiled: Record<string, unknown>): Config.InitialOptions =>
  JSON.parse(compiled['config'] as string) as Config.InitialOptions;

describe('configCompiler', () => {
  afterEach(() => {
    mockExistingFiles.clear();
  });

  describe('negative cases', () => {
    it('collects no coverage when coverage is false', () => {
      const config = parseConfig(compile({ coverage: false }));

      expect(config.collectCoverage).toBe(false);
      expect(config.collectCoverageFrom).toBeUndefined();
      expect(config.coverageThreshold).toBeUndefined();
    });

    it('lets the jest config win over the coverage option', () => {
      const config = parseConfig(
        compile({ coverage: { collectCoverageFrom: ['option/**'] } }, { collectCoverageFrom: ['project/**'] }),
      );

      expect(config.collectCoverageFrom).toEqual(['project/**']);
    });

    it('replaces the default arrays only with replaceArrays', () => {
      const config = parseConfig(
        compile({ replaceArrays: true }, { setupFilesAfterEnv: ['<rootDir>/custom.setup.ts'] }),
      );

      expect(config.setupFilesAfterEnv).toEqual(['<rootDir>/custom.setup.ts']);
    });

    it('ignores testMatch from the project config when building the CLI testMatch', () => {
      const compiled = compile({}, { testMatch: ['**/*.custom.ts'] });

      expect(compiled['testMatch']).toEqual(['<rootDir>./src/**/*.(spec|test).{js,jsx,ts,tsx}']);
    });

    it('registers no setup files when the project has none', () => {
      const config = parseConfig(compile());

      expect(config.setupFiles).toEqual([]);
      expect(config.setupFilesAfterEnv).toEqual([expect.stringContaining('text-encoder.fix')]);
      expect(config.globalSetup).toBeUndefined();
      expect(config.globalTeardown).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('extends the default setup files and ignore patterns with the jest config', () => {
      const config = parseConfig(
        compile({}, { setupFilesAfterEnv: ['<rootDir>/custom.setup.ts'], testPathIgnorePatterns: ['/fixtures/'] }),
      );

      expect(config.setupFilesAfterEnv).toEqual([
        expect.stringContaining('text-encoder.fix'),
        '<rootDir>/custom.setup.ts',
      ]);
      expect(config.testPathIgnorePatterns).toEqual([
        '<rootDir>/(build|dist|temp|docs|documentation|public|node_modules)/',
        '/fixtures/',
      ]);
    });

    it('applies coverage thresholds, reporters and files from the coverage option', () => {
      const config = parseConfig(
        compile({
          coverage: { collectCoverageFrom: ['lib/**'], reporters: ['text'], thresholds: { branches: 80, lines: 90 } },
        }),
      );

      expect(config).toMatchObject({
        collectCoverage: true,
        collectCoverageFrom: ['lib/**'],
        coverageReporters: ['text'],
        coverageThreshold: { global: { branches: 80, lines: 90 } },
      });
    });

    it('treats .mjs and .cjs files as modules to transform', () => {
      const config = parseConfig(compile());

      expect(config.moduleFileExtensions).toEqual(expect.arrayContaining(['mjs', 'cjs']));
      expect(Object.keys(config.transform ?? {})).toContain('^.+\\.(js|jsx|mjs|cjs)$');
    });

    describe.each(['.js', '.mjs', '.cjs', '.ts'])('with %s setup files', (ext) => {
      it('registers jest.init as a setup file', () => {
        mockExistingFiles.add(`${mockProjectDir}/jest.init${ext}`);

        expect(parseConfig(compile()).setupFiles).toEqual([`<rootDir>/jest.init${ext}`]);
      });

      it('registers jest.setup after the text-encoder polyfill', () => {
        mockExistingFiles.add(`${mockProjectDir}/jest.setup${ext}`);

        expect(parseConfig(compile()).setupFilesAfterEnv).toEqual([
          expect.stringContaining('text-encoder.fix'),
          `<rootDir>/jest.setup${ext}`,
        ]);
      });

      it('registers jest.global.setup as the global setup', () => {
        mockExistingFiles.add(`${mockProjectDir}/jest.global.setup${ext}`);

        expect(parseConfig(compile()).globalSetup).toBe(`${mockProjectDir}/jest.global.setup${ext}`);
      });

      it('registers jest.global.teardown as the global teardown', () => {
        mockExistingFiles.add(`${mockProjectDir}/jest.global.teardown${ext}`);

        expect(parseConfig(compile()).globalTeardown).toBe(`${mockProjectDir}/jest.global.teardown${ext}`);
      });
    });

    it('builds testMatch from a single src folder and a custom prefix', () => {
      expect(compile({ prefix: 'e2e', src: './app' })['testMatch']).toEqual([
        '<rootDir>./app/**/*.e2e.{js,jsx,ts,tsx}',
      ]);
    });

    it('builds testMatch from several src folders', () => {
      expect(compile({ src: ['./src', './lib'] })['testMatch']).toEqual([
        '<rootDir>./src/**/*.(spec|test).{js,jsx,ts,tsx}',
        '<rootDir>./lib/**/*.(spec|test).{js,jsx,ts,tsx}',
      ]);
    });

    it('uses jsdom unless the project overrides testEnvironment', () => {
      expect(parseConfig(compile()).testEnvironment).toBe('jsdom');
      expect(parseConfig(compile({}, { testEnvironment: 'node' })).testEnvironment).toBe('node');
    });

    it('transforms scripts with babel-jest and the rockpack react presets', () => {
      const { transform } = parseConfig(compile());

      expect(transform).toMatchObject({
        '^.+\\.(js|jsx|mjs|cjs)$': [
          expect.stringContaining('babel-jest'),
          { presetFor: { framework: 'react', isTest: true } },
        ],
        '^.+\\.(ts|tsx)$': [
          expect.stringContaining('babel-jest'),
          { presetFor: { framework: 'react', isTest: true, typescript: true } },
        ],
      });
    });

    it('deep-merges moduleNameMapper with the built-in style and extension mappings', () => {
      const { moduleNameMapper } = parseConfig(compile({}, { moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' } }));

      expect(moduleNameMapper).toEqual({
        '\\.(css|less|scss|sss|styl)$': expect.stringMatching(/modules\/identity-obj-proxy\.cjs$/) as unknown,
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^@/(.*)$': '<rootDir>/src/$1',
      });
    });

    it('runs watch mode with cache, in parallel and without forced coverage', () => {
      const compiled = compile({ watch: true });
      const config = parseConfig(compiled);

      expect(compiled).toMatchObject({ noCache: false, runInBand: false, watch: true });
      expect(compiled).not.toHaveProperty('maxWorkers');
      expect(config.collectCoverage).toBeUndefined();
      expect(config.coverageReporters).toBeUndefined();
      expect(config.reporters).toBeUndefined();
    });

    it('runs in parallel with cache by default', () => {
      const compiled = compile();

      expect(compiled).toMatchObject({ noCache: false, runInBand: false, watch: false });
      expect(compiled).not.toHaveProperty('maxWorkers');
    });

    it('runs one test file at a time without cache in serial mode', () => {
      expect(compile({ serial: true })).toMatchObject({ maxWorkers: 1, noCache: true, runInBand: true });
    });

    it('filters the spec files by path patterns', () => {
      expect(compile({ testPathPatterns: ['cli', 'generation'] })).toMatchObject({
        testPathPatterns: ['cli', 'generation'],
      });
      expect(compile()).not.toHaveProperty('testPathPatterns');
    });

    it('keeps watch mode fast in serial mode', () => {
      expect(compile({ serial: true, watch: true })).toMatchObject({ maxWorkers: 1, noCache: false, runInBand: false });
    });

    it('collects coverage from every source file of the src folders', () => {
      expect(parseConfig(compile({ src: ['./src', 'lib'] })).collectCoverageFrom).toEqual([
        'src/**/*.{ts,tsx,js,jsx}',
        'lib/**/*.{ts,tsx,js,jsx}',
        '!**/*.d.ts',
        '!**/*.spec.*',
        '!**/*.test.*',
      ]);
    });

    it('keeps the collectCoverageFrom of the project', () => {
      expect(parseConfig(compile({}, { collectCoverageFrom: ['app/**'] })).collectCoverageFrom).toEqual(['app/**']);
    });

    it('forces coverage and the html reporter outside of watch mode', () => {
      const config = parseConfig(compile());

      expect(config.collectCoverage).toBe(true);
      expect(config.coverageReporters).toEqual(['json', 'html', 'text-summary', 'lcov']);
      expect(config.reporters).toEqual([
        'default',
        [
          expect.stringContaining('jest-html-reporters'),
          { expand: true, filename: 'jest_reporter.html', pageTitle: 'Tests Report', publicPath: './test-reports' },
        ],
      ]);
    });

    it('keeps the coverage and reporter settings provided by the project', () => {
      const config = parseConfig(
        compile({}, { collectCoverage: false, coverageReporters: ['text'], reporters: ['summary'] }),
      );

      expect(config.collectCoverage).toBe(false);
      expect(config.coverageReporters).toEqual(['text']);
      expect(config.reporters).toEqual(['summary']);
    });

    it('passes coverageThreshold through to the jest config', () => {
      const coverageThreshold = { global: { branches: 80, functions: 85, lines: 85, statements: 85 } };

      expect(parseConfig(compile({}, { coverageThreshold })).coverageThreshold).toEqual(coverageThreshold);
    });
  });
});
