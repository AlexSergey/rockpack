import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../types/store';
import { AuthState, Roles } from '../../../types/AuthManager';

interface AccessInterface {
  children: JSX.Element|JSX.Element[];
  forRoles: Roles[];
  fallback?: () => JSX.Element;
}

export const Access = ({ children, forRoles, fallback }: AccessInterface): JSX.Element => {
  const { role } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  return forRoles.includes(role) ? (
    <>
      {children}
    </>
  ) : typeof fallback === 'function' ? fallback() : null;
};
