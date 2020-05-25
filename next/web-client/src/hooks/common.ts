import { useEffect } from 'react';

export const useWillUnmount = (cb: Function): void => useEffect(() => (): void => cb());
