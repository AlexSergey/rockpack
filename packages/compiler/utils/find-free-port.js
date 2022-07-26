const fp = require('find-free-port');

const fpPromise = (port) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-shadow
    fp(port, (err, port) => {
      if (err) {
        return reject(err);
      }

      return resolve(port);
    });
  });

module.exports = fpPromise;
