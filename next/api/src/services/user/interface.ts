import { UserModel } from '../../models/user';

export interface IUserService {
  signup(email: string, password: string): Promise<{ user: UserModel; token: string }>;

  signin(email: string, password: string): Promise<{ user: UserModel; token: string }>;

  deleteUser(id: number): Promise<void>;
}
