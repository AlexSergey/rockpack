import type { Linter } from 'eslint';

import gitignore from 'eslint-config-flat-gitignore';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { makeConfig } from './index.js';
import { makeFileTypeConfigs, makeOverrideConfigs } from './rules/files.js';
import { makeReactConfig, makeReactTestConfigs } from './rules/react.js';
import { makeStyleConfigs } from './rules/style.js';
import { makeTestConfigs } from './rules/tests.js';
import { makeRecommendedTypescriptConfigs, makeTypescriptConfig } from './rules/typescript.js';

// Every plugin is replaced with the minimal shape makeConfig reads, so specs assert on the
// structure makeConfig builds. Several plugins are ESM-only and cannot be loaded by babel-jest's
// CJS output; @eslint-react/eslint-plugin has no "require" export condition at all, hence virtual.
jest.mock(
  '@eslint-react/eslint-plugin',
  () => ({
    configs: { 'recommended-typescript': { name: 'eslint-react', rules: { '@eslint-react/marker': 'error' } } },
  }),
  { virtual: true },
);
jest.mock('@eslint/js', () => ({ configs: { recommended: { rules: { 'js/marker': 'error' } } } }));
jest.mock('@eslint/json', () => ({ configs: { recommended: { rules: { 'json/marker': 'error' } } } }));
jest.mock('@typescript-eslint/parser', () => ({ parse: jest.fn() }));
jest.mock('eslint-config-flat-gitignore', () => jest.fn(() => ({ name: 'gitignore' })));
jest.mock('eslint-plugin-check-file', () => ({ rules: {} }));
jest.mock('eslint-plugin-import-lite', () => ({ rules: {} }));
jest.mock('eslint-plugin-jest', () => ({ rules: {} }));
jest.mock('eslint-plugin-jest-dom', () => ({
  configs: { 'flat/recommended': { name: 'jest-dom', rules: { 'jest-dom/marker': 'error' } } },
}));
jest.mock('eslint-plugin-no-only-tests', () => ({ rules: {} }));
jest.mock('eslint-plugin-package-json', () => ({
  configs: { recommended: { name: 'package-json/recommended' }, stylistic: { name: 'package-json/stylistic' } },
}));
jest.mock('eslint-plugin-perfectionist', () => ({ configs: { 'recommended-natural': { name: 'perfectionist' } } }));
jest.mock('eslint-plugin-prettier/recommended', () => ({ name: 'prettier' }));
jest.mock('eslint-plugin-react-hooks', () => ({
  configs: { flat: { recommended: { name: 'react-hooks', rules: { 'react-hooks/rules-of-hooks': 'error' } } } },
}));
jest.mock('eslint-plugin-regexp', () => ({ configs: { 'flat/recommended': { name: 'regexp' } } }));
jest.mock('eslint-plugin-sonarjs', () => ({ rules: {} }));
jest.mock('eslint-plugin-testing-library', () => ({
  configs: { 'flat/react': { name: 'testing-library', rules: { 'testing-library/marker': 'error' } } },
}));
jest.mock('eslint-plugin-unicorn', () => ({ rules: {} }));
jest.mock('typescript-eslint', () => ({
  configs: {
    strictTypeChecked: [{ name: 'ts/strict-type-checked' }],
    stylisticTypeChecked: [{ name: 'ts/stylistic-type-checked' }],
  },
  plugin: { rules: {} },
}));

const gitignoreMock = gitignore as unknown as jest.Mock;

type ProjectFiles = {
  readonly files?: Readonly<Record<string, string>>;
  readonly nestedCwd?: string;
};

const projectDirs: string[] = [];

const createProject = ({ files = {}, nestedCwd }: ProjectFiles = {}): string => {
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), 'rockpack-codestyle-')));
  projectDirs.push(dir);

  Object.entries(files).forEach(([name, content]) => {
    writeFileSync(path.join(dir, name), content);
  });

  const cwd = nestedCwd ? path.join(dir, nestedCwd) : dir;
  mkdirSync(cwd, { recursive: true });
  jest.spyOn(process, 'cwd').mockReturnValue(cwd);

  return dir;
};

const findByFiles = (configs: Linter.Config[], file: string): Linter.Config | undefined =>
  configs.find((config) => config.files?.includes(file));

const getTypescriptConfig = (configs: Linter.Config[]): Linter.Config => {
  const config = configs.find((item) => item.plugins?.['@check-file'] !== undefined);
  if (!config) {
    throw new Error('custom typescript config is missing');
  }

  return config;
};

const getRuleNames = (configs: Linter.Config[]): string[] =>
  configs.flatMap((config) => Object.keys(config.rules ?? {})).sort();

const getNames = (configs: Linter.Config[]): (string | undefined)[] => configs.map((config) => config.name);

describe('makeConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    gitignoreMock.mockClear();
    projectDirs.splice(0).forEach((dir) => rmSync(dir, { force: true, recursive: true }));
  });

  describe('negative cases', () => {
    it('builds the non-react config when package.json is malformed', () => {
      createProject({ files: { 'package.json': '{ "dependencies": ' } });

      const configs = makeConfig();

      expect(getNames(configs)).not.toContain('react-hooks');
      expect(getNames(configs)).not.toContain('eslint-react');
    });

    it('builds the non-react config when react is only a devDependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ devDependencies: { react: '19.0.0' } }) } });

      expect(getNames(makeConfig())).not.toContain('react-hooks');
    });

    it('adds no testing library and jest-dom rules without react', () => {
      createProject();

      expect(getNames(makeConfig())).not.toEqual(expect.arrayContaining(['testing-library', 'jest-dom']));
    });

    it('falls back to ./tsconfig.json when the project has no tsconfig', () => {
      createProject();

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.['parserOptions']).toEqual({
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      });
    });

    it('adds no ignore config when .eslintflatignore is not found', () => {
      createProject();

      const configs = makeConfig();

      expect(gitignoreMock).not.toHaveBeenCalled();
      expect(getNames(configs)).not.toContain('gitignore');
    });
  });

  describe('positive cases', () => {
    it('returns the configs in a stable order', () => {
      createProject();

      expect(getNames(makeConfig())).toEqual([
        'ts/strict-type-checked',
        'ts/stylistic-type-checked',
        'prettier',
        'perfectionist',
        'regexp',
        undefined,
        undefined,
        'package-json/recommended',
        undefined,
        'package-json/stylistic',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('scopes the typescript-eslint presets to ts files', () => {
      createProject();

      const configs = makeConfig().slice(0, 2);

      expect(configs.map((config) => config.files)).toEqual([['**/*.{ts,tsx,mts,cts}'], ['**/*.{ts,tsx,mts,cts}']]);
    });

    it('scopes the recommended js rules to js files with node, jest and browser globals', () => {
      createProject();

      const config = findByFiles(makeConfig(), '**/*.{js,jsx,mjs,cjs}');

      expect(config?.rules).toEqual({ 'js/marker': 'error' });
      expect(config?.languageOptions?.['globals']).toMatchObject({ describe: false, document: false, process: false });
    });

    it('adds the @eslint-react block without its duplicate rules-of-hooks when react is a dependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      const reactConfig = makeConfig().find((config) => config.name === 'eslint-react');

      expect(reactConfig).toEqual({
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
        name: 'eslint-react',
        rules: { '@eslint-react/marker': 'error', '@eslint-react/rules-of-hooks': 'off' },
      });
    });

    it('keeps the react hooks rules in a block of their own when react is a dependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      const hooksConfig = makeConfig().find((config) => config.name === 'react-hooks');

      expect(hooksConfig).toEqual({
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
        name: 'react-hooks',
        rules: { 'react-hooks/rules-of-hooks': 'error' },
      });
    });

    it('adds the testing library and jest-dom rules to the test files of react projects', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      const configs = makeConfig().filter((config) => config.name === 'testing-library' || config.name === 'jest-dom');

      expect(configs).toEqual([
        {
          files: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
          name: 'testing-library',
          rules: { 'testing-library/marker': 'error' },
          settings: {
            'testing-library/custom-queries': 'off',
            'testing-library/custom-renders': 'off',
            'testing-library/utils-module': 'off',
          },
        },
        { files: ['**/*.{spec,test}.{js,jsx,ts,tsx}'], name: 'jest-dom', rules: { 'jest-dom/marker': 'error' } },
      ]);
    });

    it('uses tsconfig.json for type-aware linting when it exists', () => {
      const dir = createProject({ files: { 'tsconfig.json': '{}' } });

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.['parserOptions']).toEqual({
        project: path.join(dir, 'tsconfig.json'),
        tsconfigRootDir: dir,
      });
    });

    it('prefers tsconfig.eslint.json over tsconfig.json', () => {
      const dir = createProject({ files: { 'tsconfig.eslint.json': '{}', 'tsconfig.json': '{}' } });

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.['parserOptions']).toEqual({
        project: path.join(dir, 'tsconfig.eslint.json'),
        tsconfigRootDir: dir,
      });
    });

    it('adds the ignore config from .eslintflatignore in the current directory', () => {
      const dir = createProject({ files: { '.eslintflatignore': 'lib\n' } });

      const configs = makeConfig();

      expect(gitignoreMock).toHaveBeenCalledWith({ files: path.join(dir, '.eslintflatignore'), strict: false });
      expect(configs[0]).toEqual({ name: 'gitignore' });
      expect(configs).toHaveLength(16);
    });

    it('finds .eslintflatignore in an ancestor directory', () => {
      const dir = createProject({ files: { '.eslintflatignore': 'lib\n' }, nestedCwd: 'packages/app' });

      makeConfig();

      expect(gitignoreMock).toHaveBeenCalledWith({ files: path.join(dir, '.eslintflatignore'), strict: false });
    });

    it('enforces kebab-case file and folder names under src', () => {
      createProject();

      const { rules } = getTypescriptConfig(makeConfig());

      expect(rules?.['@check-file/filename-naming-convention']).toEqual([
        'error',
        { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ]);
      expect(rules?.['@check-file/folder-naming-convention']).toEqual(['error', { 'src/**/': 'KEBAB_CASE' }]);
    });

    it('prefers type aliases, limits cognitive complexity and forbids console, default exports and focused tests', () => {
      createProject();

      const { rules } = getTypescriptConfig(makeConfig());

      expect(rules).toMatchObject({
        '@import-lite/no-default-export': 'error',
        '@no-only-tests/no-only-tests': 'error',
        '@sonar/cognitive-complexity': ['error', 20],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        'no-console': 'error',
      });
    });

    it('allows default exports, any type names and constructor-only classes in declaration files', () => {
      createProject();

      expect(findByFiles(makeConfig(), '**/*.d.ts')?.rules).toEqual({
        '@import-lite/no-default-export': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
      });
    });

    it('allows default exports in eslint, storybook and tool config files', () => {
      createProject();

      const config = findByFiles(makeConfig(), '**/eslint.config.ts');

      expect(config?.files).toEqual(expect.arrayContaining(['**/*.stories.@(js|jsx|ts|tsx|mdx)', '**/vite.config.ts']));
      expect(config?.rules).toEqual({ '@import-lite/no-default-export': 'off' });
    });

    it('enables jest globals and relaxes rules for specs and fixtures', () => {
      createProject();

      const config = findByFiles(makeConfig(), '**/*.{spec,test}.{js,jsx,ts,tsx}');

      expect(config?.files).toContain('**/__fixtures__/**');
      expect(config?.languageOptions?.['globals']).toMatchObject({ describe: false, expect: false, jest: false });
      expect(config?.rules).toEqual({
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'jest/no-alias-methods': 'error',
        'jest/no-conditional-expect': 'error',
        'jest/no-disabled-tests': 'error',
        'jest/no-done-callback': 'error',
        'jest/no-export': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-interpolation-in-snapshots': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-mocks-import': 'error',
        'jest/no-standalone-expect': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/valid-describe-callback': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error',
        'jest/valid-title': 'error',
      });
    });

    it('allows non-kebab-case folder names inside fixtures', () => {
      createProject();

      const configs = makeConfig();

      expect(configs[configs.length - 1]).toEqual({
        files: ['**/__fixtures__/**'],
        rules: { '@check-file/folder-naming-convention': 'off' },
      });
    });

    it('enables the react rules when react is forced without a react dependency', () => {
      createProject();

      expect(getNames(makeConfig({ react: true }))).toContain('eslint-react');
    });

    it('skips the react rules when react is turned off despite a react dependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      expect(getNames(makeConfig({ react: false }))).not.toContain('eslint-react');
    });

    it('uses the given tsconfig relative to the working directory', () => {
      const dir = createProject({ files: { 'tsconfig.json': '{}' } });

      const { languageOptions } = getTypescriptConfig(makeConfig({ tsconfig: 'tsconfig.lint.json' }));

      expect(languageOptions?.['parserOptions']).toEqual({
        project: path.join(dir, 'tsconfig.lint.json'),
        tsconfigRootDir: dir,
      });
    });

    it('reads the given ignore file instead of searching for .eslintflatignore', () => {
      const dir = createProject({ files: { '.eslintflatignore': 'lib\n', '.gitignore': 'dist\n' } });

      makeConfig({ ignoreFile: '.gitignore' });

      expect(gitignoreMock).toHaveBeenCalledWith({ files: path.join(dir, '.gitignore'), strict: false });
    });

    it('adds no ignore config when ignoreFile is false', () => {
      createProject({ files: { '.eslintflatignore': 'lib\n' } });

      const configs = makeConfig({ ignoreFile: false });

      expect(gitignoreMock).not.toHaveBeenCalled();
      expect(getNames(configs)).not.toContain('gitignore');
    });

    it('leaves out the jest configs when jest is false', () => {
      createProject();

      const configs = makeConfig({ jest: false });

      expect(findByFiles(configs, '**/*.{spec,test}.{js,jsx,ts,tsx}')).toBeUndefined();
      expect(findByFiles(configs, '**/__fixtures__/**')).toBeUndefined();
      expect(configs).toHaveLength(makeConfig().length - 2);
    });

    it('leaves out the testing library and jest-dom rules of a react project when jest is false', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      expect(getNames(makeConfig({ jest: false }))).not.toEqual(
        expect.arrayContaining(['testing-library', 'jest-dom']),
      );
    });
  });
});

// Rule names only, not severities: a rule dropped by a refactoring shows up as a snapshot diff in review.
describe('rule groups', () => {
  describe('negative cases', () => {
    it('adds no rules for a project without react', () => {
      expect(makeReactConfig(false)).toEqual([]);
    });

    it('adds no test configs for a project without react', () => {
      expect(makeReactTestConfigs(false)).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it.each([
      ['files', (): Linter.Config[] => [...makeFileTypeConfigs(), ...makeOverrideConfigs()]],
      ['react', (): Linter.Config[] => makeReactConfig(true)],
      ['style', (): Linter.Config[] => makeStyleConfigs()],
      ['tests', (): Linter.Config[] => makeTestConfigs()],
      [
        'typescript',
        (): Linter.Config[] => [...makeRecommendedTypescriptConfigs(), makeTypescriptConfig(false, '/project')],
      ],
    ])('keeps the %s rule names', (_group, makeConfigs) => {
      expect(getRuleNames(makeConfigs())).toMatchSnapshot();
    });
  });
});
