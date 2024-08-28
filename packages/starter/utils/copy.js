import recursiveCopy from 'recursive-copy';

export const copy = (source, destination) => {
  return new Promise((resolve, reject) => {
    recursiveCopy(
      source,
      destination,
      {
        dot: true,
        overwrite: true,
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
};
