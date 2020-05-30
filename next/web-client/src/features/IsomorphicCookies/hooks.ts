import { useContext } from 'react';
import { CookiesContext } from './Container';

export const useCookie = (field: string): string | undefined => (
  useContext(CookiesContext)
    .getCookies(field)
);
