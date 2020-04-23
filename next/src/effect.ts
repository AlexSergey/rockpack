interface StateInterface {
  text: string;
}

export const effect = (): Promise<StateInterface> => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));
