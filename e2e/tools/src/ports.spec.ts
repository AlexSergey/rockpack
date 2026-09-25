import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getFreePort, serveStatic, waitForUrl } from './ports.js';

describe('ports', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-e2e-tools-'));
    writeFileSync(path.join(dir, 'index.html'), '<h1>home</h1>');
    writeFileSync(path.join(dir, 'app.js'), 'console.log(1);');
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('fails when a URL does not answer in time', async () => {
      const port = await getFreePort();

      await expect(waitForUrl(`http://localhost:${port}`, 300)).rejects.toThrow('did not answer within 300 ms');
    });

    it('serves index.html for unknown paths', async () => {
      const server = await serveStatic(dir);

      await expect((await fetch(`${server.url}/missing/route`)).text()).resolves.toBe('<h1>home</h1>');
      await server.close();
    });
  });

  describe('positive cases', () => {
    it('returns a port that can be listened on', async () => {
      const port = await getFreePort();
      const server = http.createServer();

      await new Promise<void>((resolve) => server.listen(port, resolve));
      await new Promise<void>((resolve) => server.close(() => resolve()));

      expect(port).toBeGreaterThan(0);
    });

    it('closes at once while a client holds a connection with an unfinished request, as browsers do', async () => {
      const server = await serveStatic(dir);
      const socket = net.connect(Number(new URL(server.url).port), 'localhost');
      await new Promise<void>((resolve) => socket.once('connect', () => resolve()));
      // Headers without the closing empty line: Node.js would wait for them until its headers timeout.
      try {
        await new Promise<void>((resolve) => socket.write('GET / HTTP/1.1\r\nHost: localhost\r\n', () => resolve()));
        const started = Date.now();

        await server.close();

        expect(Date.now() - started).toBeLessThan(1000);
      } finally {
        socket.destroy();
      }
    });

    it('serves files with their content type and records the requests', async () => {
      const server = await serveStatic(dir);

      await waitForUrl(server.url);
      const response = await fetch(`${server.url}/app.js`);

      expect(response.headers.get('content-type')).toBe('text/javascript');
      await expect(response.text()).resolves.toBe('console.log(1);');
      expect(server.requests).toContain('/app.js');
      await server.close();
    });
  });
});
