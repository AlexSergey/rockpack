import { UserModel } from '../../models/User';

export interface UserServiceInterface {
  signup(email: string, password: string): Promise<{ user: UserModel; token: string }>;

  signin(email: string, password: string): Promise<{ user: UserModel; token: string }>;

  deleteUser(id: number): Promise<void>;
}
