import React from 'react';
import { useUser } from '../hooks';

interface OwnerInterface {
  children: JSX.Element | JSX.Element[];
  forUser: string;
}

export const Owner = ({ children, forUser }: OwnerInterface): JSX.Element|null => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email === forUser ? (
    <>
      {children}
    </>
  ) : null;
};
