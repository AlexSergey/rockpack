import { config } from '../../config';
import { IUser } from '../../types/user';
import { IRest } from '../../utils/rest';

interface IUserData extends Record<string, string> {
  email: string;
  password: string;
}

interface IUserRes {
  data: IUser;
}

export interface IUserService {
  authorization: () => Promise<IUserRes>;

  signIn: (user: IUserData) => Promise<IUserRes>;

  signOut: () => Promise<void>;

  signUp: (user: IUserData) => Promise<IUserRes>;
}

export const userService = (rest: IRest): IUserService => ({
  authorization: () => rest.get(`${config.api}/v1/users/authorization`),

  signIn: (user) => rest.post(`${config.api}/v1/users/signin`, user),

  signOut: () => rest.get(`${config.api}/v1/users/signout`),

  signUp: (user) => rest.post(`${config.api}/v1/users/signup`, user),
});
