import { getFreePort, start } from '@rockpack/e2e-tools';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, node, prepareFixture, read } from './fixtures';

describe('backendCompiler and isomorphicCompiler production builds', () => {
  describe('negative cases', () => {
    it('rejects isomorphicCompiler without a backend', async () => {
      const dir = prepareFixture('isomorphic-basic');
      const { code, output } = await build(dir, 'scripts.no-backend.ts');

      expect(code).toBe(1);
      expect(output).toContain('[rockpack] INVALID_CONFIG: backendCompiler is required to set isomorphicCompiler');
    });
  });

  describe('positive cases', () => {
    describe('backend-basic', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('backend-basic'));
      });

      it('runs with node', async () => {
        const { code, output } = await node(dir, ['dist/index.js']);

        expect(code).toBe(0);
        expect(output.trim()).toBe('{"from":"backend","merged":true}');
      });

      it('keeps node_modules out of the bundle', () => {
        expect(read(dir, 'dist/index.js')).toContain('require("deepmerge")');
        expect(existsSync(path.join(dir, 'dist/index.html'))).toBe(false);
      });
    });

    describe('isomorphic-basic', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('isomorphic-basic'));
      });

      it('builds the client without the development reloader', () => {
        expect(readdirSync(path.join(dir, 'public')).filter((file) => file.endsWith('.js'))).toEqual(['index.js']);
      });

      it('builds with the deprecated promise form', async () => {
        const { dir: legacyDir } = await buildFixture('isomorphic-basic', 'scripts.legacy.ts');

        expect(readdirSync(path.join(legacyDir, 'public')).filter((file) => file.endsWith('.js'))).toEqual([
          'index.js',
        ]);
        expect(read(legacyDir, 'dist/index.js')).toContain('Hello SSR');
      });

      it('serves the server-rendered markup', async () => {
        const port = await getFreePort();
        const server = start(process.execPath, ['dist/index.js'], { cwd: dir, env: { PORT: String(port) } });
        try {
          await server.waitForOutput(/listening on/);
          const html = await (await fetch(`http://localhost:${port}/`)).text();

          expect(html).toContain('<div id="root"><h1>Hello SSR</h1></div>');
        } finally {
          await server.stop();
        }
      });
    });
  });
});
