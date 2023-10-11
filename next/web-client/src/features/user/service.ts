import { config } from '../../config';
import { IUser } from '../../types/user';
import { IRest } from '../../utils/rest';

type UserData = {
  email: string;
  password: string;
};

type UserRes = { data: IUser };

export interface IUserService {
  authorization: () => Promise<UserRes>;

  signIn: (user: UserData) => Promise<UserRes>;

  signOut: () => Promise<void>;

  signUp: (user: UserData) => Promise<UserRes>;
}

export const userService = (rest: IRest): IUserService => ({
  authorization: () => rest.get(`${config.api}/v1/users/authorization`),

  signIn: (user) => rest.post(`${config.api}/v1/users/signin`, user),

  signOut: () => rest.get(`${config.api}/v1/users/signout`),

  signUp: (user) => rest.post(`${config.api}/v1/users/signup`, user),
});
