import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, loadPage, node, prepareFixture, read } from './fixtures';

const tsc = (dir: string, file: string): ReturnType<typeof node> =>
  node(dir, [
    require.resolve('typescript/bin/tsc'),
    '--ignoreConfig',
    '--noEmit',
    '--strict',
    '--skipLibCheck',
    '--jsx',
    'react-jsx',
    file,
  ]);

describe('libraryCompiler and sourceCompiler production builds', () => {
  describe('negative cases', () => {
    it('rejects invalid libraryCompiler options', async () => {
      const dir = prepareFixture('library-umd');
      const { code, output } = await build(dir, 'scripts.invalid-options.ts');

      expect(code).toBe(1);
      expect(output).toContain('[rockpack] INVALID_CONFIG');
    });
  });

  describe('positive cases', () => {
    describe('library-umd', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('library-umd'));
      });

      it('exposes the library to require()', async () => {
        const { code, output } = await node(dir, ['-e', "console.log(require('./dist/index.js').greet('node'))"]);

        expect(code).toBe(0);
        expect(output.trim()).toBe('Hello, node');
      });

      it('exposes the library as a global to a script tag', () => {
        const dom = loadPage('<!DOCTYPE html><html><body></body></html>', [read(dir, 'dist/index.js')]);
        const lib = (dom.window as unknown as { MyLib?: { greet: (name: string) => string } }).MyLib;

        expect(lib?.greet('browser')).toBe('Hello, browser');
        dom.window.close();
      });
    });

    describe('library-formats', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('library-formats'));
      });

      it('builds an ESM entry for import()', async () => {
        const { code, output } = await node(dir, [
          '--input-type=module',
          '-e',
          "const m = await import('./lib/esm/index.mjs'); console.log(m.format('esm'), typeof m.Label)",
        ]);

        expect(code).toBe(0);
        expect(output.trim()).toBe('ESM function');
      });

      it('builds a CommonJS entry for require()', async () => {
        const { code, output } = await node(dir, [
          '-e',
          "const m = require('./lib/cjs/index.cjs'); console.log(m.format('cjs'), typeof m.Label)",
        ]);

        expect(code).toBe(0);
        expect(output.trim()).toBe('CJS function');
      });

      it('keeps the externals out of the UMD bundle', () => {
        expect(read(dir, 'dist/index.js')).not.toContain('react.transitional.element');
      });

      it('emits declarations without the specs', () => {
        expect(readdirSync(path.join(dir, 'dist/types')).sort()).toEqual(['format.d.ts', 'index.d.ts']);
        expect(existsSync(path.join(dir, 'lib/esm/format.spec.mjs'))).toBe(false);
      });

      it('emits declarations a TypeScript consumer can use', async () => {
        writeFileSync(
          path.join(dir, 'consumer.ts'),
          "import type { LabelProps } from './dist/types/index';\n\nexport const props: LabelProps = { text: 'a' };\n",
        );
        const { code, output } = await tsc(dir, 'consumer.ts');

        expect(output).toBe('');
        expect(code).toBe(0);
      });
    });

    describe('source-only', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('source-only'));
      });

      it('rewrites the relative imports to the output extensions', () => {
        expect(read(dir, 'lib/esm/index.mjs')).toContain('./utils/sum.mjs');
        expect(read(dir, 'lib/cjs/index.cjs')).toContain('./utils/sum.cjs');
      });

      it('runs both formats', async () => {
        const esm = await node(dir, [
          '--input-type=module',
          '-e',
          "console.log((await import('./lib/esm/index.mjs')).total)",
        ]);
        const cjs = await node(dir, ['-e', "console.log(require('./lib/cjs/index.cjs').total)"]);

        expect([esm.output.trim(), cjs.output.trim()]).toEqual(['5', '5']);
      });

      it('copies the assets and skips the specs', () => {
        expect(read(dir, 'lib/esm/assets/data.json')).toBe('{ "copied": true }\n');
        expect(readdirSync(path.join(dir, 'lib/esm/utils'))).toEqual(['sum.mjs']);
        expect(readdirSync(path.join(dir, 'types/utils'))).toEqual(['sum.d.ts']);
      });

      it('emits declarations', () => {
        expect(read(dir, 'types/index.d.ts')).toContain('export declare const total: number;');
      });
    });
  });
});
