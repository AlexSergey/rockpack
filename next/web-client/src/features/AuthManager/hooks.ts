import { useDispatch, useSelector } from 'react-redux';
import { signin, signup, signout } from './actions';
import { AuthInterface, AuthState } from '../../types/AuthManager';
import { RootState } from '../../types/store';

export const useUser = (): AuthState => {
  const { email, role } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  return { email, role };
};

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
