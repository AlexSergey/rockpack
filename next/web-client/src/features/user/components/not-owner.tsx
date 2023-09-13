import { useUser } from '../hooks';

interface INotOwner {
  children: JSX.Element | JSX.Element[];
  forUser: string;
}

export const NotOwner = ({ children, forUser }: INotOwner): JSX.Element | null => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email !== forUser ? <>{children}</> : null;
};
