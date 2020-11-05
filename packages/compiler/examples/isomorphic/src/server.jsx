import React from 'react';
import express from 'express';
import { App } from './App';
import { renderToString } from 'react-dom/server';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.static('public'));

app.get('/*', async (req, res) => {
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

    ${!isProduction ? `<script src="/dev-server.js"></script>` : ''}
</body>
</html>
`);
});

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
