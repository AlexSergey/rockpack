import React from 'react';
import { useUser } from '../hooks';

interface NotOwnerInterface {
  children: JSX.Element | JSX.Element[];
  forUser: string;
}

export const NotOwner = ({ children, forUser }: NotOwnerInterface): JSX.Element | null => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email !== forUser ? (
    <>
      {children}
    </>
  ) : null;
};
