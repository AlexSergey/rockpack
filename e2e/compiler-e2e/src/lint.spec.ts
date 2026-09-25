import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, prepareFixture, read } from './fixtures';

describe('linting during builds (lint: true)', () => {
  describe('negative cases', () => {
    it('fails on an ESLint error from eslint.config.ts', async () => {
      const dir = prepareFixture('frontend-lint');
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('no-var');
    });

    it('fails on a Stylelint error from .stylelintrc.cjs', async () => {
      const dir = prepareFixture('frontend-lint');
      writeFileSync(path.join(dir, 'src/index.js'), "import './styles.css';\n\ndocument.title = 'lint';\n");
      writeFileSync(path.join(dir, 'src/styles.css'), 'a {\n  color: red;\n}\n');
      writeFileSync(path.join(dir, '.stylelintrc.cjs'), "module.exports = { rules: { 'color-named': 'never' } };\n");
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('color-named');
    });
  });

  describe('positive cases', () => {
    it('does not lint without the lint option', async () => {
      const { dir } = await buildFixture('frontend-lint', 'scripts.no-lint.mts');

      expect(read(dir, 'dist/index.js')).toContain('lint');
    });

    it('skips ESLint when debug is on', async () => {
      const { dir } = await buildFixture('frontend-lint', 'scripts.debug.mts');

      expect(read(dir, 'dist/index.js')).toContain('lint');
    });
  });
});
