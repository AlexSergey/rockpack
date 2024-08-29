export const sleep = (delay: number) => (): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));
