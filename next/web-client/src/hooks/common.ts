import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useWillUnmount = (cb: Function): void => useEffect(() => (): void => cb(), []);
