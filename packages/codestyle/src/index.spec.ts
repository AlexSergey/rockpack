import type { Linter } from 'eslint';

import gitignore from 'eslint-config-flat-gitignore';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { isString, makeConfig } from './index';

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
jest.mock('@typescript-eslint/eslint-plugin', () => ({ rules: {} }));
jest.mock('@typescript-eslint/parser', () => ({ parse: jest.fn() }));
jest.mock('eslint-config-flat-gitignore', () => jest.fn(() => ({ name: 'gitignore' })));
jest.mock('eslint-plugin-check-file', () => ({ rules: {} }));
jest.mock('eslint-plugin-import-lite', () => ({ rules: {} }));
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
jest.mock('eslint-plugin-unicorn', () => ({ rules: {} }));
jest.mock('typescript-eslint', () => ({
  configs: {
    recommended: [{ name: 'ts/recommended' }],
    recommendedTypeChecked: [{ name: 'ts/recommended-type-checked' }],
    stylistic: [{ name: 'ts/stylistic' }],
  },
}));

const gitignoreMock = gitignore as unknown as jest.Mock;

interface ProjectFiles {
  readonly files?: Readonly<Record<string, string>>;
  readonly nestedCwd?: string;
}

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

const getNames = (configs: Linter.Config[]): (string | undefined)[] => configs.map((config) => config.name);

describe('isString', () => {
  describe('negative cases', () => {
    it('returns false for non-string values', () => {
      expect([undefined, null, 1, {}, []].some((value) => isString(value))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('returns true for strings', () => {
      expect(isString('')).toBe(true);
    });
  });
});

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
      expect(configs).toContainEqual({});
    });

    it('builds the non-react config when react is only a devDependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ devDependencies: { react: '19.0.0' } }) } });

      expect(getNames(makeConfig())).not.toContain('react-hooks');
    });

    it('falls back to ./tsconfig.json when the project has no tsconfig', () => {
      createProject();

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.parserOptions).toEqual({ project: './tsconfig.json' });
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
        'ts/recommended',
        'ts/stylistic',
        'ts/recommended-type-checked',
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

      const configs = makeConfig().slice(0, 3);

      expect(configs.map((config) => config.files)).toEqual([['**/*.{ts,tsx}'], ['**/*.{ts,tsx}'], ['**/*.{ts,tsx}']]);
    });

    it('scopes the recommended js rules to js files with node, jest and browser globals', () => {
      createProject();

      const config = findByFiles(makeConfig(), '**/*.{js,jsx,mjs,cjs}');

      expect(config?.rules).toEqual({ 'js/marker': 'error' });
      expect(config?.languageOptions?.globals).toMatchObject({ describe: false, document: false, process: false });
    });

    it('adds the react hooks and @eslint-react block when react is a dependency', () => {
      createProject({ files: { 'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }) } });

      const reactConfig = makeConfig().find((config) => config.name === 'eslint-react');

      expect(reactConfig).toEqual({
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        name: 'eslint-react',
        rules: { '@eslint-react/marker': 'error' },
        settings: { react: { version: 'detect' } },
      });
    });

    it('uses tsconfig.json for type-aware linting when it exists', () => {
      const dir = createProject({ files: { 'tsconfig.json': '{}' } });

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.parserOptions).toEqual({ project: path.join(dir, 'tsconfig.json') });
    });

    it('prefers tsconfig.eslint.json over tsconfig.json', () => {
      const dir = createProject({ files: { 'tsconfig.eslint.json': '{}', 'tsconfig.json': '{}' } });

      const { languageOptions } = getTypescriptConfig(makeConfig());

      expect(languageOptions?.parserOptions).toEqual({ project: path.join(dir, 'tsconfig.eslint.json') });
    });

    it('adds the ignore config from .eslintflatignore in the current directory', () => {
      const dir = createProject({ files: { '.eslintflatignore': 'lib\n' } });

      const configs = makeConfig();

      expect(gitignoreMock).toHaveBeenCalledWith({ files: path.join(dir, '.eslintflatignore'), strict: false });
      expect(configs[0]).toEqual({ name: 'gitignore' });
      expect(configs).toHaveLength(18);
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

    it('limits cognitive complexity and forbids console, default exports and focused tests', () => {
      createProject();

      const { rules } = getTypescriptConfig(makeConfig());

      expect(rules).toMatchObject({
        '@import-lite/no-default-export': 'error',
        '@no-only-tests/no-only-tests': 'error',
        '@sonar/cognitive-complexity': ['error', 20],
        'no-console': 'error',
      });
    });

    it('allows default exports and any type names in declaration files', () => {
      createProject();

      expect(findByFiles(makeConfig(), '**/*.d.ts')?.rules).toEqual({
        '@import-lite/no-default-export': 'off',
        '@typescript-eslint/naming-convention': 'off',
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

      const config = findByFiles(makeConfig(), '**/*.spec.{ts,tsx}');

      expect(config?.files).toContain('**/__fixtures__/**');
      expect(config?.languageOptions?.globals).toMatchObject({ describe: false, expect: false, jest: false });
      expect(config?.rules).toEqual({
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/unbound-method': 'off',
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
  });
});
