import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types/store';
import { AuthState, Roles } from '../../types/AuthManager';

interface AccessInterface {
  children: JSX.Element|JSX.Element[];
  forRoles: Roles[];
}

export const Access = ({ children, forRoles }: AccessInterface): JSX.Element => {
  const { role } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  return forRoles.includes(role) ? (
    <>
      {children}
    </>
  ) : null;
};
