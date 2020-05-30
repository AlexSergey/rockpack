import { useDispatch, useSelector } from 'react-redux';
import { useWillMount } from '@rockpack/ussr';
import { signin, signup, signout, authorization } from './actions';
import { AuthInterface, AuthState } from '../../types/AuthManager';
import { RootState } from '../../types/store';

export const useUser = (): AuthState => {
  const { email, role } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  return { email, role };
};

export const useGuard = (token: string | undefined): void => {
  const dispatch = useDispatch();
  useWillMount((resolver) => dispatch(authorization({ token, resolver })));
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
