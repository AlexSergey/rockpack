import { isValidElement, ReactElement } from 'react';

import { Roles } from '../../../types/user';
import { useRole } from '../hooks';

interface Access {
  children: Callback | ReactElement | ReactElement[];
  fallback?: () => ReactElement;
  forRoles: Roles[];
}

type Callback = (match: boolean) => ReactElement;

export const Access = ({ children, fallback, forRoles }: Access): ReactElement => {
  const role = useRole();

  if (typeof children === 'function' && !isValidElement(children)) {
    return <>{children(forRoles.includes(role))}</>;
  }

  // eslint-disable-next-line no-nested-ternary
  return forRoles.includes(role) ? <>{children}</> : typeof fallback === 'function' ? fallback() : null;
};
