import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';

// Asks the OS for a free port.
export const getFreePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === 'object') {
          resolve(address.port);
        } else {
          reject(new Error('Could not get a free port'));
        }
      });
    });
  });

// Polls the URL until it answers with a 2xx status.
export const waitForUrl = async (url: string, timeout = 60_000): Promise<void> => {
  const deadline = Date.now() + timeout;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = (error as Error).message;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${url} did not answer within ${timeout} ms (${lastError})`);
};

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

export type StaticServer = {
  readonly close: () => Promise<void>;
  readonly requests: readonly string[];
  readonly url: string;
};

// Serves a folder over HTTP on a free port; unknown paths fall back to index.html like a single-page app host.
export const serveStatic = async (root: string): Promise<StaticServer> => {
  const requests: string[] = [];
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    requests.push(pathname);
    let file = path.join(root, pathname);
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
      file = path.join(root, 'index.html');
    }
    response.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(response);
  });
  const port = await getFreePort();
  await new Promise<void>((resolve) => server.listen(port, resolve));

  return {
    // Browsers keep spare sockets open without sending a request; close() alone would wait for their headers timeout.
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      }),
    requests,
    url: `http://localhost:${port}`,
  };
};
