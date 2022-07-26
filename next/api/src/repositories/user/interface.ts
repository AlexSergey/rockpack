import { UserModel } from '../../models/user';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<UserModel>;

  getUserById(id: number): Promise<UserModel>;

  getUsers(): Promise<UserModel[]>;
}
