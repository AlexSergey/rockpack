const fp = require('find-free-port');

const fpPromise = (port) =>
  new Promise((resolve, reject) => {
    fp(port, (err, port) => {
      if (err) {
        return reject(err);
      }

      return resolve(port);
    });
  });

module.exports = fpPromise;
