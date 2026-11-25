import { getFreePort, start } from '@rockpack/e2e-tools';
import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, node, prepareFixture, read } from './fixtures';

describe('backendCompiler and isomorphicCompiler production builds', () => {
  describe('negative cases', () => {
    it('rejects isomorphicCompiler without a backend', async () => {
      const dir = prepareFixture('isomorphic-basic');
      const { code, output } = await build(dir, 'scripts.no-backend.mts');

      expect(code).toBe(1);
      expect(output).toContain('[rockpack] INVALID_CONFIG: backendCompiler is required to set isomorphicCompiler');
    });

    it('keeps the value of .env over the environment without env.runtime', async () => {
      const { dir } = await buildFixture('backend-dotenv');
      const { output } = await node(dir, ['dist/index.js'], { PORT: '3000' });

      expect(output.trim()).toBe('8888|[name]|');
    });

    it('fails with env.runtime when a variable from .env.example is missing in .env', async () => {
      const dir = prepareFixture('backend-dotenv');
      writeFileSync(path.join(dir, '.env'), 'PATTERN=x\n');
      const { code, output } = await build(dir, 'scripts.runtime.mts');

      expect(code).toBe(1);
      expect(output).toContain('PORT');
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

    describe('backend-dotenv with env.runtime', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('backend-dotenv', 'scripts.runtime.mts'));
      });

      it('reads a variable set when the bundle starts', async () => {
        const { output } = await node(dir, ['dist/index.js'], { PORT: '3000' });

        expect(output.trim()).toBe('3000|[name]|30');
      });

      it('falls back to .env and .env.defaults', async () => {
        const { output } = await node(dir, ['dist/index.js']);

        expect(output.trim()).toBe('8888|[name]|30');
      });

      it('falls back to .env.defaults when the project has no .env', async () => {
        const defaultsOnly = prepareFixture('backend-dotenv');
        rmSync(path.join(defaultsOnly, '.env'));
        rmSync(path.join(defaultsOnly, '.env.example'));
        const { code, output } = await build(defaultsOnly, 'scripts.runtime.mts');

        expect({ code, output }).toMatchObject({ code: 0 });
        expect((await node(defaultsOnly, ['dist/index.js'], { PORT: '3000' })).output.trim()).toBe('3000||30');
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
        const { dir: legacyDir } = await buildFixture('isomorphic-basic', 'scripts.legacy.mts');

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

      it('listens on the port of the environment, or of .env, with env.runtime', async () => {
        const [envPort, port] = [await getFreePort(), await getFreePort()];
        const runtimeDir = prepareFixture('isomorphic-basic');
        writeFileSync(path.join(runtimeDir, '.env'), `PORT=${envPort}\n`);
        const { code, output } = await build(runtimeDir, 'scripts.runtime-env.mts');
        expect({ code, output }).toMatchObject({ code: 0 });

        for (const [env, expected] of [
          [{ PORT: String(port) }, port],
          [{}, envPort],
        ] as const) {
          const server = start(process.execPath, ['dist/index.js'], { cwd: runtimeDir, env });
          try {
            const [, listening] = await server.waitForOutput(/listening on http:\/\/localhost:(\d+)/);

            expect(Number(listening)).toBe(expected);
          } finally {
            await server.stop();
          }
        }
      });
    });
  });
});
