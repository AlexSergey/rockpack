module.exports = function(app) {
    /**
     * @api {get} /
     * @apiVersion 1.0.0
     * @apiGroup Main
     * @apiSuccess {String} body Hello World! string.
     */
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
};
