// eslint-disable-next-line import/prefer-default-export
export const sleep = (delay) => () => (
  new Promise((resolve) => (
    setTimeout(resolve, delay)
  ))
);
