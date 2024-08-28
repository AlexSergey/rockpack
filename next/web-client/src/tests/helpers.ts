export const sleep = (delay: number) => (): Promise<void> =>
  new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(resolve, delay),
  );
