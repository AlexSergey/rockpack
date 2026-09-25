import type { StartedProcess } from '@rockpack/e2e-tools';

import { getFreePort, run, waitForUrl } from '@rockpack/e2e-tools';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { prepareFixture, read, startDev } from './fixtures';

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

// The live reload port the client bundle was built with (the compiler inlines it).
const liveReloadPort = (bundle: string): number => Number(/(\d{4,5})\D{0,6}\/livereload\.js/.exec(bundle)?.[1]);

// Waits for the dev server to answer; on failure the error carries the server output, which is what explains a hang.
const waitForServer = async (server: StartedProcess, url: string): Promise<void> => {
  try {
    await waitForUrl(url, 120_000);
  } catch (error) {
    throw new Error(`${(error as Error).message}\n--- server output ---\n${server.output()}`, { cause: error });
  }
};

const text = async (url: string): Promise<string> => (await fetch(url)).text();

const count = (output: string, pattern: RegExp): number => output.match(new RegExp(pattern, 'g'))?.length ?? 0;

describe('development mode', () => {
  describe('negative cases', () => {
    it('moves to a free port when the configured one is busy', async () => {
      const busy = await getFreePort();
      const blocker = await occupy(busy);
      const server = startDev(prepareFixture('frontend-basic'), 'scripts.port.mts', { FIXTURE_PORT: String(busy) });
      try {
        const [, url = ''] = await server.waitForOutput(SERVER_URL, 120_000);
        await waitForServer(server, url);

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
        await waitForServer(server, url);
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

      it('stops the dev server through the result so the process can exit', async () => {
        const script = run(process.execPath, ['scripts.result.mts', '--_rockpack_testing'], {
          cwd: dir,
          env: { NODE_ENV: 'development' },
          timeout: 120_000,
        });
        const { code, output } = await script;

        expect(output).toMatch(/result: dev-server http:\/\/localhost:\d+/);
        expect(output).toContain('stopped');
        expect(code).toBe(0);
      }, 150_000);

      it('uses the configured port when it is free', async () => {
        const port = await getFreePort();
        const exact = startDev(dir, 'scripts.port.mts', { FIXTURE_PORT: String(port) });
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
        const output = server.output();
        const inspector = count(output, /node-inspect is available on \d+ port/);

        expect(inspector).toBeGreaterThanOrEqual(1);
        // Every successful compilation prints the messages again (a Linux runner may rebuild right after start);
        // each report must list the inspector once.
        expect(inspector).toBe(count(output, /nodemon is running/));
        expect(output).toContain('Debugger listening on ws://');
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

      let blocker: net.Server | undefined;

      beforeAll(async () => {
        // Holding the default live reload port proves the compiler picks another one.
        blocker = (await isPortFree(LIVE_RELOAD_PORT)) ? await occupy(LIVE_RELOAD_PORT) : undefined;
        dir = prepareFixture('isomorphic-basic');
        const port = await getFreePort();
        url = `http://localhost:${port}`;
        server = startDev(dir, 'scripts.build.mts', { PORT: String(port) });
        await waitForServer(server, url);
      }, 180_000);

      afterAll(async () => {
        await server.stop();
        blocker?.close();
      });

      it('serves the server-rendered markup', async () => {
        expect(await text(url)).toContain('<h1>Hello SSR</h1>');
      });

      it('serves live reload on a free port when the default one is taken', async () => {
        const port = liveReloadPort(read(dir, 'public/dev-server.js'));

        expect(port).toBeGreaterThan(LIVE_RELOAD_PORT);
        expect((await fetch(`http://localhost:${port}/livereload.js`)).status).toBe(200);
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
