interface StateInterface {
  [key: string]: unknown;
}

export const isBackend = (): boolean => typeof window === 'undefined';

export const clone = (state: StateInterface): StateInterface => (
  JSON.parse(
    JSON.stringify(state)
  )
);
