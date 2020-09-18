const { ncp } = require('ncp');

const copy = (source, destination, options = {}) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, options, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  })
}

module.exports = copy;
