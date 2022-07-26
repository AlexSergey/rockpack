import { useEffect } from 'react';

export const useWillUnmount = (cb: () => void): void => useEffect(() => (): void => cb(), []);
