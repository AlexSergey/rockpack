import http from 'node:http';

export async function waitForServer(url: string, timeout = 100000): Promise<void> {
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const check = (): void => {
      http
        .get(url, (res): void => {
          if (res.statusCode === 200) return resolve();
          else retry();
        })
        .on('error', retry);
    };
    const retry = (): void => {
      if (Date.now() - start > timeout) {
        reject(new Error('Server did not start in time'));
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  });
}
