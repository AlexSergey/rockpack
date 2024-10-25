import { ReactElement } from 'react';

import { useUser } from '../hooks';

interface NotOwner {
  children: ReactElement | ReactElement[];
  forUser: string;
}

export const NotOwner = ({ children, forUser }: NotOwner): null | ReactElement => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email !== forUser ? <>{children}</> : null;
};
