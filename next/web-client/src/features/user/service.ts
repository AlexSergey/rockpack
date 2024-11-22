import { config } from '../../config';
import { User } from '../../types/user';
import { Rest } from '../../utils/rest';

export interface UserService {
  authorization: () => Promise<UserRes>;

  signIn: (user: UserData) => Promise<UserRes>;

  signOut: () => Promise<void>;

  signUp: (user: UserData) => Promise<UserRes>;
}

interface UserData extends Record<string, string> {
  email: string;
  password: string;
}

interface UserRes {
  data: User;
}

export const userService = (rest: Rest): UserService => ({
  authorization: () => rest.get(`${config.api}/v1/users/authorization`),

  signIn: (user) => rest.post(`${config.api}/v1/users/signin`, user),

  signOut: () => rest.get(`${config.api}/v1/users/signout`),

  signUp: (user) => rest.post(`${config.api}/v1/users/signup`, user),
});
