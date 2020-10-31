interface StateInterface {
  [key: string]: unknown;
}

export const isBackend = (): boolean => typeof window === 'undefined';

export const isClient = (): boolean => !isBackend();

export const clone = (state: StateInterface): Readonly<StateInterface> => (
  JSON.parse(
    JSON.stringify(state)
  )
);

export const getRandomID = (): string => `${Math.random()}`;
