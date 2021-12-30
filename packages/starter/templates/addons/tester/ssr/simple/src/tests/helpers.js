// eslint-disable-next-line import/prefer-default-export
export const sleep = (delay) => () => (
  new Promise((resolve) => (
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(resolve, delay)
  ))
);
