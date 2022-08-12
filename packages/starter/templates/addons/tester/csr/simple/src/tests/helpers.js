// eslint-disable-next-line no-promise-executor-return
export const sleep = (delay) => () => new Promise((resolve) => setTimeout(resolve, delay));
