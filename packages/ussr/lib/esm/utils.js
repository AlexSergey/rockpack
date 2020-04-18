export const isBackend = () => typeof window === 'undefined';
export const clone = (state) => (JSON.parse(JSON.stringify(state)));
