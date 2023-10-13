import { ReactElement } from 'react';

import { useUser } from '../hooks';

interface INotOwner {
  children: ReactElement | ReactElement[];
  forUser: string;
}

export const NotOwner = ({ children, forUser }: INotOwner): ReactElement | null => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email !== forUser ? <>{children}</> : null;
};
