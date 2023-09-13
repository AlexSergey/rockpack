import { useUser } from '../hooks';

interface IOwner {
  children: JSX.Element | JSX.Element[];
  forUser: string;
}

export const Owner = ({ children, forUser }: IOwner): JSX.Element | null => {
  const { email } = useUser();

  if (!email) {
    return null;
  }

  return email === forUser ? <>{children}</> : null;
};
