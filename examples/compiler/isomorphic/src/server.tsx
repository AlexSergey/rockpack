import type { Request, Response } from 'express';

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { App } from './app';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.use(express.static('public'));

app.get('/*', (_req: Request, res: Response) => {
  const html = renderToString(<App />);

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
    ${!isProduction ? '<script src="/dev-server.js"></script>' : ''}
</body>
</html>
`);
});

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port http://localhost:4000!');
});
