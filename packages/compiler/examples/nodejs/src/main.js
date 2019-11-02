import text from 'text';
import http from 'http';
const port = 3000;

const render = (message) => {
    return `<!DOCTYPE html>
<head>
    <meta charset="utf-8" />
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <script src="http://localhost:35729/livereload.js"></script>
    <title></title>
</head>
<body>
    <div id="wrapper">
        ${message}
    </div>
</body>
</html>`;
};

const requestHandler = (request, response) => {
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(render(text));
    response.end();
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
