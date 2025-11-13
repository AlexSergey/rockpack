const Koa = require('koa');
const serve = require('koa-static');
const path = require('node:path');

const app = new Koa();

const mode = process.argv[2];

app.use(serve(path.resolve(__dirname, `./generators/csr-${mode}-tests/dist`)));

app.listen(4000, () => {
  console.log(`Server is listening ${4000} port`);
});
