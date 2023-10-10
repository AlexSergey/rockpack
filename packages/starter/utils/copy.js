import recursiveCopy from 'recursive-copy';

export const copy = (source, destination) => {
  return new Promise((resolve, reject) => {
    recursiveCopy(source, destination, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  })
}
