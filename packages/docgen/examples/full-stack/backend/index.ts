var express = require('express');
var app = express();
const api = requir('./api/v1');

api(app);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
