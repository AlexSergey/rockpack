import type { StartedProcess } from '@rockpack/e2e-tools';

import { getFreePort, waitForUrl } from '@rockpack/e2e-tools';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { prepareFixture, startDev } from './fixtures';

// The isomorphic dev server always listens for live reload on this port.
const LIVE_RELOAD_PORT = 35_729;
const SERVER_URL = /Starting server on (http:\/\/\S+)/;

const edit = (file: string, from: string, to: string): void => {
  const source = readFileSync(file, 'utf8');
  if (!source.includes(from)) {
    throw new Error(`${file} does not contain ${from}`);
  }
  writeFileSync(file, source.replace(from, to));
};

const occupy = (port: number): Promise<net.Server> =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => resolve(server));
  });

const isPortFree = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, () => server.close(() => resolve(true)));
  });

const text = async (url: string): Promise<string> => (await fetch(url)).text();

const count = (output: string, pattern: RegExp): number => output.match(new RegExp(pattern, 'g'))?.length ?? 0;

describe('development mode', () => {
  describe('negative cases', () => {
    it('moves to a free port when the configured one is busy', async () => {
      const busy = await getFreePort();
      const blocker = await occupy(busy);
      const server = startDev(prepareFixture('frontend-basic'), 'scripts.port.ts', { FIXTURE_PORT: String(busy) });
      try {
        const [, url = ''] = await server.waitForOutput(SERVER_URL, 120_000);
        await waitForUrl(url);

        expect(url).not.toBe(`http://localhost:${busy}`);
        expect(await text(url)).toContain('index.js');
      } finally {
        await server.stop();
        blocker.close();
      }
    }, 180_000);
  });

  describe('positive cases', () => {
    describe('frontend-basic', () => {
      let dir: string;
      let server: StartedProcess;
      let url: string;

      beforeAll(async () => {
        dir = prepareFixture('frontend-basic');
        server = startDev(dir);
        [, url = ''] = await server.waitForOutput(SERVER_URL, 120_000);
        await waitForUrl(url);
      }, 180_000);

      afterAll(async () => {
        await server.stop();
      });

      it('serves the page and a bundle with the hot reload client', async () => {
        expect(await text(url)).toContain('index.js');
        expect(await text(`${url}/index.js`)).toContain('webpack-dev-server');
      });

      it('rebuilds after a source change', async () => {
        edit(path.join(dir, 'src/index.tsx'), 'Hello from Rockpack', 'Hello again');
        let bundle = '';
        while (!bundle.includes('Hello again')) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          bundle = await text(`${url}/index.js`);
        }

        expect(existsSync(path.join(dir, 'dist/index.js'))).toBe(true);
      }, 60_000);

      it('uses the configured port when it is free', async () => {
        const port = await getFreePort();
        const exact = startDev(dir, 'scripts.port.ts', { FIXTURE_PORT: String(port) });
        try {
          const [, exactUrl] = await exact.waitForOutput(SERVER_URL, 120_000);

          expect(exactUrl).toBe(`http://localhost:${port}`);
        } finally {
          await exact.stop();
        }
      }, 180_000);
    });

    describe('backend-basic', () => {
      let dir: string;
      let server: StartedProcess;

      beforeAll(async () => {
        dir = prepareFixture('backend-basic');
        server = startDev(dir);
        await server.waitForOutput(/"merged":true/, 120_000);
      }, 180_000);

      afterAll(async () => {
        await server.stop();
      });

      it('runs the bundle under nodemon with the inspector', () => {
        expect(count(server.output(), /node-inspect is available on \d+ port/)).toBe(1);
        expect(server.output()).toContain('Debugger listening on ws://');
      });

      it('restarts the program after a source change', async () => {
        edit(path.join(dir, 'src/index.ts'), "from: 'backend'", "from: 'restarted'");

        await expect(server.waitForOutput(/"from":"restarted"/, 60_000)).resolves.toBeTruthy();
      }, 90_000);
    });

    describe('isomorphic-basic', () => {
      let dir: string;
      let server: StartedProcess;
      let url: string;

      beforeAll(async () => {
        if (!(await isPortFree(LIVE_RELOAD_PORT))) {
          throw new Error(`Port ${LIVE_RELOAD_PORT} is busy: stop the process that holds the live reload port`);
        }
        dir = prepareFixture('isomorphic-basic');
        const port = await getFreePort();
        url = `http://localhost:${port}`;
        server = startDev(dir, 'scripts.build.ts', { PORT: String(port) });
        await waitForUrl(url, 120_000);
      }, 180_000);

      afterAll(async () => {
        await server.stop();
      });

      it('serves the server-rendered markup', async () => {
        expect(await text(url)).toContain('<h1>Hello SSR</h1>');
      });

      it('builds the client with the live reload script and serves live reload', async () => {
        expect(existsSync(path.join(dir, 'public/dev-server.js'))).toBe(true);
        expect((await fetch(`http://localhost:${LIVE_RELOAD_PORT}/livereload.js`)).status).toBe(200);
      });

      it('restarts the server after a source change', async () => {
        edit(path.join(dir, 'src/app.tsx'), 'Hello SSR', 'Hello restarted');
        let html = '';
        while (!html.includes('Hello restarted')) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          html = await text(url).catch(() => '');
        }

        expect(count(server.output(), /listening on/)).toBeGreaterThanOrEqual(2);
      }, 90_000);
    });
  });
});
