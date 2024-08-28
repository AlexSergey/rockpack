import http from 'http';
import text from 'text';

const port = 3000;

const render = (message) => `<!DOCTYPE html>
<head>
    <meta charset="utf-8" />
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    ${process.env.NODE_ENV === 'development' ? '<script src="/dev-server.js"></script>' : ''}
    <title></title>
</head>
<body>
    <div id="wrapper">
        ${message}
    </div>
</body>
</html>`;

const requestHandler = (request, response) => {
  response.writeHeader(200, { 'Content-Type': 'text/html' });
  response.write(render(text));
  response.end();
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});
