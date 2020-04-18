import React from 'react';
import express from 'express';
import serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import createUssr from '../../../src';

const app = express();

app.use(express.static('public'));

app.get('/*', async (req, res) => {
  console.log('test');
  const [runEffects, UssrRecord] = createUssr({ });
  
  renderToString(
    <UssrRecord>
      <App />
    </UssrRecord>
  );
  const state = await runEffects();
  const [, Ussr] = createUssr(state);
  const b = renderToString(
    <Ussr>
      <App />
    </Ussr>
  );
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${b}</div>
    <script src="/index.js"></script>
</body>
</html>

`);
});

app.listen(4000, () => {
  console.log('Example app listening on port 3000!');
});
