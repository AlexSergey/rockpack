import { createServer } from 'node:http';
import { renderToString } from 'react-dom/server';

import { App } from './app';

const port = Number(process.env.PORT ?? 4000);

createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html><html><body><div id="root">${renderToString(<App />)}</div></body></html>`);
}).listen(port, () => {
  process.stdout.write(`listening on http://localhost:${port}\n`);
});
