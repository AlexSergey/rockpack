import { useDispatch } from 'react-redux';
import { signin, signup, signout } from './actions';
import { AuthInterface } from '../../types/AuthManager';

export const useAuth = (): AuthInterface => {
  const dispatch = useDispatch();

  return {
    signin: (user): void => {
      dispatch(signin(user));
    },
    signup: (user): void => {
      dispatch(signup(user));
    },
    signout: (): void => {
      dispatch(signout());
    }
  };
};
