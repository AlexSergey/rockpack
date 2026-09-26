import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { renderToString } from 'react-dom/server';

import { App } from './app';

const port = Number(process.env['PORT'] ?? 4000);
// The compiler builds dev-server.js, the live reload client, in development only.
const scripts = process.env['NODE_ENV'] === 'production' ? ['index.js'] : ['index.js', 'dev-server.js'];

createServer((req, res) => {
  const file = path.basename(req.url ?? '/');
  if (scripts.includes(file)) {
    readFile(path.resolve('public', file)).then(
      (source) => {
        res.setHeader('Content-Type', 'text/javascript');
        res.end(source);
      },
      () => {
        res.statusCode = 404;
        res.end();
      },
    );

    return;
  }
  const tags = scripts.map((script) => `<script src="/${script}"></script>`).join('');
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html><html><body><div id="root">${renderToString(<App />)}</div>${tags}</body></html>`);
}).listen(port, () => {
  process.stdout.write(`listening on http://localhost:${port}\n`);
});
