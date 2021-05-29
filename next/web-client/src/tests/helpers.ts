// eslint-disable-next-line import/prefer-default-export
export const sleep = (delay: number) => (): Promise<void> => (
  new Promise((resolve) => (
    setTimeout(resolve, delay)
  ))
);
