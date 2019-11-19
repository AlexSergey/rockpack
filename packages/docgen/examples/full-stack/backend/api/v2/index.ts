module.exports = function(app) {
    /**
     * @api {get} /
     * @apiVersion 2.0.0
     * @apiGroup Main
     * @apiSuccess {String} body Hello World 2! string.
     */
    app.get('/', function (req, res) {
        res.send('Hello World 2!');
    });
};
