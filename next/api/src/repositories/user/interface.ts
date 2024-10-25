import { UserModel } from '../../models/user';

export interface UserRepositoryInterface {
  getUserByEmail(email: string): Promise<UserModel>;

  getUserById(id: number): Promise<UserModel>;

  getUsers(): Promise<UserModel[]>;
}
