import { makeKnipConfig } from './knip-config.js';

describe('makeKnipConfig', () => {
  describe('negative cases', () => {
    it('adds no test entries and no source-map exception without the tester', () => {
      const config = makeKnipConfig({ appType: 'csr', nogit: false, tester: false });

      expect(config.entry).not.toContain('jest.init.ts');
      expect(config.entry).not.toContain('src/**/*.spec.{ts,tsx}');
      expect(config.ignoreDependencies).not.toContain('source-map');
    });

    it('adds no lint-staged entry without git', () => {
      expect(makeKnipConfig({ appType: 'csr', nogit: true, tester: false }).entry).not.toContain('.lintstagedrc.cjs');
    });

    it('leaves out the ignore field and the stylelint binary for a library', () => {
      const config = makeKnipConfig({ appType: 'library', nogit: false, tester: false });

      expect(config).not.toHaveProperty('ignore');
      expect(config.ignoreBinaries).not.toContain('stylelint');
    });

    it('adds no jest setup entry for a library, which has no DOM', () => {
      expect(makeKnipConfig({ appType: 'library', nogit: false, tester: true }).entry).not.toContain('jest.setup.ts');
    });
  });

  describe('positive cases', () => {
    it('lists the linter configs and the sources the compiler bundles', () => {
      expect(makeKnipConfig({ appType: 'ssr', nogit: false, tester: false }).entry).toEqual([
        'eslint.config.ts',
        '.commitlintrc.cjs',
        '.stylelintrc.cjs',
        'src/client.tsx',
        'src/server.tsx',
        'src/types/*.ts',
        '.lintstagedrc.cjs',
      ]);
    });

    it('adds the test setup and the specs with the tester', () => {
      const config = makeKnipConfig({ appType: 'component', nogit: false, tester: true });

      expect(config.entry).toEqual(expect.arrayContaining(['jest.init.ts', 'jest.setup.ts', 'src/**/*.spec.{ts,tsx}']));
      expect(config.ignoreDependencies).toContain('source-map');
    });

    it('ignores the build output that .gitignore does not cover', () => {
      expect(makeKnipConfig({ appType: 'ssr', nogit: false, tester: false }).ignore).toEqual(['public/**']);
      expect(makeKnipConfig({ appType: 'component', nogit: false, tester: false }).ignore).toEqual(['lib/**']);
    });

    it('allows the tools that @rockpack packages bring and the dependencies used outside imports', () => {
      const config = makeKnipConfig({ appType: 'ssr', nogit: false, tester: false });

      expect(config.ignoreBinaries).toEqual(['commitlint', 'eslint', 'prettier', 'stylelint', 'tsc']);
      expect(config.ignoreDependencies).toEqual(['@rockpack/tsconfig', '@issr/babel-plugin']);
    });
  });
});
