// eslint-disable-next-line no-promise-executor-return
export const sleep = (delay: number) => (): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));
