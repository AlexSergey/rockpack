import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useWillUnmount = (cb: () => void): void => useEffect(() => (): void => cb(), []);
