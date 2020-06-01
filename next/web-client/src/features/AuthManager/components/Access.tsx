import React, { isValidElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../types/store';
import { AuthState, Roles } from '../../../types/AuthManager';

type Callback = (match: boolean) => JSX.Element;

interface AccessInterface {
  children: JSX.Element | JSX.Element[] | Callback;
  forRoles: Roles[];
  fallback?: () => JSX.Element;
}

export const Access = ({ children, forRoles, fallback }: AccessInterface): JSX.Element => {
  const { role } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  if (typeof children === 'function' && !isValidElement(children)) {
    return (
      <>
        {children(forRoles.includes(role))}
      </>
    );
  }

  return forRoles.includes(role) ? (
    <>
      {children}
    </>
  ) : typeof fallback === 'function' ? fallback() : null;
};
