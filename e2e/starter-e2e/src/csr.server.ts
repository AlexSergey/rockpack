import Koa from 'koa';
import serve from 'koa-static';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Koa();

const mode = process.argv[2];

app.use(serve(resolve(__dirname, `./generators/csr-${mode}-tests/dist`)));

app.listen(4000, () => {
  console.log(`Server is listening ${4000} port`);
});
