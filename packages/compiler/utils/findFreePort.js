let fp = require("find-free-port");

let fpPromise = (port) => {
    return new Promise((resolve, reject) => {
        fp(port, (err, port) => {
            if (err) {
                return reject(err);
            }
            return resolve(port);
        })
    })
};

module.exports = fpPromise;