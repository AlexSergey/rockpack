import { ReactElement } from 'react';

import { useUser } from '../hooks';

interface Owner {
  children: ReactElement | ReactElement[];
  forUser: string;
}

export const Owner = ({ children, forUser }: Owner): null | ReactElement => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email === forUser ? <>{children}</> : null;
};
