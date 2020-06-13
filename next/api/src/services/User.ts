import { BadRequest, SequelizeError, UserAlreadyExists, UserNotFound, WrongPassword } from '../errors/errors';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';
import { UserRepository } from '../repositories/User';
import { createToken } from '../utils/auth';
import { config } from '../config';

export class UserService {
  static signup = async (email: string, password: string): Promise<{ user: UserModel; token: string }> => {
    const user = await UserModel.findOne({
      where: {
        email
      }
    });

    const userRole = await RoleModel.findOne({
      where: {
        role: 'user'
      }
    });

    if (user) {
      throw new UserAlreadyExists();
    }

    if (!userRole) {
      throw new BadRequest();
    }

    try {
      const newUser = await UserModel.create({
        email,
        password,
        role_id: userRole.get('id')
      });

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      const createdUser = await UserRepository.getUserById(newUser.get('id'));

      return { user: createdUser, token };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static signin = async (email: string, password: string): Promise<{ user: UserModel; token: string }> => {
    let isValid;
    let user;

    try {
      user = await UserRepository.getUserByEmail(email);

      isValid = await user.isValidPassword(password);
    } catch (e) {
      throw new SequelizeError(e);
    }

    if (!isValid) {
      throw new WrongPassword();
    }

    const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

    return { user, token };
  };

  static deleteUser = async (id: number): Promise<void> => {
    const user = await UserModel.destroy({
      where: {
        id
      },
      individualHooks: true
    });

    if (!user) {
      throw new UserNotFound();
    }
  };
}
