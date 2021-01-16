import config from '../../config';
import { User } from '../../types/User';
import { RestInterface } from '../../utils/rest';

type UserData = {
  email: string;
  password: string;
};

type UserRes = { data: User };

export interface UserServiceInterface {
  signIn: (user: UserData) => Promise<UserRes>;

  authorization: () => Promise<UserRes>;

  signUp: (user: UserData) => Promise<UserRes>;

  signOut: () => Promise<void>;
}

export const userService = (rest: RestInterface): UserServiceInterface => ({
  signIn: (user) => rest.post(`${config.api}/v1/users/signin`, user),

  authorization: () => rest.get(`${config.api}/v1/users/authorization`),

  signUp: (user) => rest.post(`${config.api}/v1/users/signup`, user),

  signOut: () => rest.get(`${config.api}/v1/users/signout`)
});
