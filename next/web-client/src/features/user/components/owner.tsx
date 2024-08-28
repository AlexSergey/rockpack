import { ReactElement } from 'react';

import { useUser } from '../hooks';

interface IOwner {
  children: ReactElement | ReactElement[];
  forUser: string;
}

export const Owner = ({ children, forUser }: IOwner): null | ReactElement => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email === forUser ? <>{children}</> : null;
};
