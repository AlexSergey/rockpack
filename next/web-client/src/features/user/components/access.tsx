import { isValidElement } from 'react';

import { Roles } from '../../../types/user';
import { useRole } from '../hooks';

type Callback = (match: boolean) => JSX.Element;

interface IAccess {
  children: Callback | JSX.Element | JSX.Element[];
  fallback?: () => JSX.Element;
  forRoles: Roles[];
}

export const Access = ({ children, fallback, forRoles }: IAccess): JSX.Element => {
  const role = useRole();

  if (typeof children === 'function' && !isValidElement(children)) {
    return <>{children(forRoles.includes(role))}</>;
  }

  // eslint-disable-next-line no-nested-ternary
  return forRoles.includes(role) ? <>{children}</> : typeof fallback === 'function' ? fallback() : null;
};
