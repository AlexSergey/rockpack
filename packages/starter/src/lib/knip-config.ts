import type { AppType } from './wizard.js';

export type KnipConfig = {
  readonly entry: readonly string[];
  readonly ignore?: readonly string[];
  readonly ignoreBinaries: readonly string[];
  readonly ignoreDependencies: readonly string[];
};

type KnipOptions = {
  readonly appType: AppType;
  readonly tester: boolean;
};

// The sources the rockpack compiler bundles: knip cannot read them from its config. The scripts.*.mts files are
// found through package.json scripts.
const APP_ENTRIES: Readonly<Record<AppType, readonly string[]>> = {
  component: ['src/index.tsx', 'example/src/index.tsx'],
  csr: ['src/index.tsx', 'src/types/*.ts'],
  library: ['src/index.ts', 'example/src/index.ts'],
  ssr: ['src/client.tsx', 'src/server.tsx', 'src/types/*.ts'],
};

// Build output that .gitignore does not cover and package.json does not publish.
const APP_OUTPUT: Readonly<Record<AppType, readonly string[]>> = {
  component: [],
  csr: [],
  library: [],
  ssr: ['public/**'],
};

// Knip runs without its eslint, stylelint, commitlint and jest plugins because the project has no direct
// dependency on those tools: @rockpack/codestyle, @rockpack/compiler and @rockpack/tester bring them.
// .lintstagedrc.cjs is found through the lint-staged command of the git hook.
export const makeKnipConfig = ({ appType, tester }: KnipOptions): KnipConfig => ({
  entry: [
    'eslint.config.ts',
    '.commitlintrc.cjs',
    '.stylelintrc.cjs',
    ...APP_ENTRIES[appType],
    ...(tester ? ['jest.init.ts', ...(appType === 'library' ? [] : ['jest.setup.ts']), 'src/**/*.spec.{ts,tsx}'] : []),
  ],
  ...(APP_OUTPUT[appType].length > 0 ? { ignore: APP_OUTPUT[appType] } : {}),
  ignoreBinaries: ['commitlint', 'eslint', 'prettier', ...(appType === 'library' ? [] : ['stylelint']), 'tsc'],
  // @rockpack/tsconfig is extended by tsconfig.json, @issr/babel-plugin is resolved by the ssr scripts at runtime,
  // source-map is a pinned tester dependency that no project file imports.
  ignoreDependencies: [
    '@rockpack/tsconfig',
    ...(appType === 'ssr' ? ['@issr/babel-plugin'] : []),
    ...(tester ? ['source-map'] : []),
  ],
});
