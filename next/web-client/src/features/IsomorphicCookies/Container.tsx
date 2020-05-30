import React, { createContext } from 'react';

export const CookiesContext = createContext(null);

export const CookiesContainer = ({ children, getCookies }:
{ children: JSX.Element; getCookies: (field: string) => string | undefined }) => (
  <CookiesContext.Provider value={{ getCookies }}>
    {children}
  </CookiesContext.Provider>
);
