import React, { isValidElement } from 'react';
import { useRole } from '../hooks';
import { Roles } from '../../../types/User';

type Callback = (match: boolean) => JSX.Element;

interface AccessInterface {
  children: JSX.Element | JSX.Element[] | Callback;
  forRoles: Roles[];
  fallback?: () => JSX.Element;
}

export const Access = ({ children, forRoles, fallback }: AccessInterface): JSX.Element => {
  const role = useRole();

  if (typeof children === 'function' && !isValidElement(children)) {
    return (
      <>
        {children(forRoles.includes(role))}
      </>
    );
  }

  return forRoles.includes(role) ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {children}
    </>
  ) : typeof fallback === 'function' ? fallback() : null;
};
