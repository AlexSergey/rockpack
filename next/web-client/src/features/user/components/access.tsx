import React, { isValidElement } from 'react';

import { Roles } from '../../../types/user';
import { useRole } from '../hooks';

type Callback = (match: boolean) => JSX.Element;

interface IAccess {
  children: JSX.Element | JSX.Element[] | Callback;
  forRoles: Roles[];
  fallback?: () => JSX.Element;
}

export const Access = ({ children, forRoles, fallback }: IAccess): JSX.Element => {
  const role = useRole();

  if (typeof children === 'function' && !isValidElement(children)) {
    return <>{children(forRoles.includes(role))}</>;
  }

  // eslint-disable-next-line no-nested-ternary
  return forRoles.includes(role) ? <>{children}</> : typeof fallback === 'function' ? fallback() : null;
};
