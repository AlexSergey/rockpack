import fp from 'find-free-port';

export const fpPromise = (port: number): Promise<number> =>
  new Promise<number>((resolve, reject) => {
    fp(port, (err, freePort) => {
      if (err) {
        return reject(err);
      }

      return resolve(freePort);
    });
  });
