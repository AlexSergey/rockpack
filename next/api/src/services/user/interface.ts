import { UserModel } from '../../models/user';

export interface IUserService {
  deleteUser(id: number): Promise<void>;

  signin(email: string, password: string): Promise<{ token: string; user: UserModel }>;

  signup(email: string, password: string): Promise<{ token: string; user: UserModel }>;
}
