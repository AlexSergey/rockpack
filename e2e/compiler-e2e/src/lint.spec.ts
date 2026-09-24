import { build, buildFixture, prepareFixture, read } from './fixtures';

// Stylelint is not covered: under tsx its webpack plugin cannot require stylelint (noted in Plan 4 step 5).
describe('ESLint during builds', () => {
  describe('negative cases', () => {
    it('fails on an ESLint error when debug is off', async () => {
      const dir = prepareFixture('frontend-lint');
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('no-var');
    });
  });

  describe('positive cases', () => {
    it('skips ESLint when debug is on', async () => {
      const { dir } = await buildFixture('frontend-lint', 'scripts.debug.ts');

      expect(read(dir, 'dist/index.js')).toContain('lint');
    });
  });
});
