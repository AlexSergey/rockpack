import { ReactElement, isValidElement } from 'react';

import { Roles } from '../../../types/user';
import { useRole } from '../hooks';

type Callback = (match: boolean) => ReactElement;

interface IAccess {
  children: Callback | ReactElement | ReactElement[];
  fallback?: () => ReactElement;
  forRoles: Roles[];
}

export const Access = ({ children, fallback, forRoles }: IAccess): ReactElement => {
  const role = useRole();

  if (typeof children === 'function' && !isValidElement(children)) {
    return <>{children(forRoles.includes(role))}</>;
  }

  // eslint-disable-next-line no-nested-ternary
  return forRoles.includes(role) ? <>{children}</> : typeof fallback === 'function' ? fallback() : null;
};
