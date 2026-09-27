import { makeKnipConfig } from './knip-config.js';

describe('makeKnipConfig', () => {
  describe('negative cases', () => {
    it('adds no test entries and no source-map exception without the tester', () => {
      const config = makeKnipConfig({ appType: 'csr', tester: false });

      expect(config.entry).not.toContain('jest.init.ts');
      expect(config.entry).not.toContain('src/**/*.spec.{ts,tsx}');
      expect(config.ignoreDependencies ?? []).not.toContain('source-map');
    });

    it('leaves .lintstagedrc.cjs to the lint-staged command of the git hook', () => {
      expect(makeKnipConfig({ appType: 'csr', tester: false }).entry).not.toContain('.lintstagedrc.cjs');
    });

    it('leaves out the stylelint binary for a library', () => {
      expect(makeKnipConfig({ appType: 'library', tester: false }).ignoreBinaries).not.toContain('stylelint');
    });

    it('leaves build output, tsc and @rockpack/tsconfig to .gitignore and the knip typescript plugin', () => {
      const config = makeKnipConfig({ appType: 'ssr', tester: true });

      expect(config).not.toHaveProperty('ignore');
      expect(config.ignoreBinaries).not.toContain('tsc');
      expect(config.ignoreDependencies).not.toContain('@rockpack/tsconfig');
    });

    it('leaves out the ignoreDependencies field when nothing needs an exception', () => {
      expect(makeKnipConfig({ appType: 'csr', tester: false })).not.toHaveProperty('ignoreDependencies');
    });

    it('adds no jest setup entry for a library, which has no DOM', () => {
      expect(makeKnipConfig({ appType: 'library', tester: true }).entry).not.toContain('jest.setup.ts');
    });
  });

  describe('positive cases', () => {
    it('lists the linter configs and the sources the compiler bundles', () => {
      expect(makeKnipConfig({ appType: 'ssr', tester: false }).entry).toEqual([
        'eslint.config.ts',
        '.commitlintrc.cjs',
        '.stylelintrc.cjs',
        'src/client.tsx',
        'src/server.tsx',
        'src/types/*.ts',
      ]);
    });

    it('adds the test setup and the specs with the tester', () => {
      const config = makeKnipConfig({ appType: 'component', tester: true });

      expect(config.entry).toEqual(expect.arrayContaining(['jest.init.ts', 'jest.setup.ts', 'src/**/*.spec.{ts,tsx}']));
      expect(config.ignoreDependencies).toContain('source-map');
    });

    it('allows the tools that @rockpack packages bring and the dependencies used outside imports', () => {
      const config = makeKnipConfig({ appType: 'ssr', tester: false });

      expect(config.ignoreBinaries).toEqual(['commitlint', 'eslint', 'prettier', 'stylelint']);
      expect(config.ignoreDependencies).toEqual(['@issr/babel-plugin']);
    });
  });
});
