import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { build, prepareFixture } from './fixtures';

// The e2e processes have no terminal, so this is the plain output: the lines CI logs and tools read.
// eslint-disable-next-line no-control-regex -- the escape codes the reporter must not write here
const CURSOR_MOVEMENT = /\u001B\[\d*[ABK]/;

describe('build output (plain mode)', () => {
  describe('negative cases', () => {
    it('reports a syntax error with the file and the code frame', async () => {
      const { code, output } = await build(prepareFixture('frontend-basic'), 'scripts.syntax-error.mts');

      expect(code).toBe(1);
      expect(output).toContain(' ✖ frontend  1 error');
      expect(output).toMatch(/ {3}Syntax {2}src\/broken\.ts {2}Unexpected token \(1:22\)/);
      expect(output).toContain('> 1 | export const broken = ;');
    });

    it('reports a missing module with the importing line', async () => {
      const dir = prepareFixture('frontend-basic');
      writeFileSync(
        path.join(dir, 'src/index.tsx'),
        "import { nope } from './nope';\n\ndocument.title = String(nope);\n",
      );
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain("   Module not found  src/index.tsx:1  Can't resolve './nope' in 'src'");
    });

    it('reports a type error with its position once', async () => {
      const dir = prepareFixture('frontend-ts');
      writeFileSync(path.join(dir, 'src/extra.ts'), "export const count: number = 'many';\n");
      writeFileSync(
        path.join(dir, 'src/index.ts'),
        "import { count } from './extra';\n\ndocument.title = String(count);\n",
      );
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output.match(/TypeScript {2}src\/extra\.ts:1:14 {2}TS2322/g)).toHaveLength(1);
    });

    it('reports a style syntax error', async () => {
      const dir = prepareFixture('frontend-basic');
      writeFileSync(path.join(dir, 'src/broken.css'), 'a {\n  color:\n');
      writeFileSync(path.join(dir, 'src/index.tsx'), "import './broken.css';\n\ndocument.title = 'css';\n");
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('   CSS  src/broken.css');
      expect(output).toContain('Unclosed block');
      expect(output).not.toContain('HookWebpackError');
    });
  });

  describe('positive cases', () => {
    it('prints a start line and one summary line with the output size, without cursor movement', async () => {
      const { code, output } = await build(prepareFixture('frontend-basic'));

      expect(code).toBe(0);
      expect(output).toContain(' ● frontend  building');
      expect(output).toMatch(/ ✔ frontend {2}built in \d+\.\d+s, dist {2}\d+(\.\d)? (B|kB|MB)/);
      expect(output).not.toMatch(CURSOR_MOVEMENT);
      expect(output).not.toMatch(/ +\n/);
      expect(output).not.toContain('Compiled successfully');
    });
  });
});
