import { Injectable } from 'friendly-di';

import { config } from '../../config';
import {
  BadRequestError,
  SequelizeError,
  UserAlreadyExistsError,
  UserNotFoundError,
  WrongPasswordError,
} from '../../errors';
import { logger } from '../../logger';
import { RoleModel } from '../../models/role';
import { UserModel } from '../../models/user';
import { UserRepository } from '../../repositories/user';
import { createToken } from '../../utils/auth';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  deleteUser = async (id: number): Promise<void> => {
    const user = await UserModel.destroy({
      individualHooks: true,
      where: {
        id,
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }
  };

  signin = async (email: string, password: string): Promise<{ token: string; user: UserModel }> => {
    let isValid;
    let user;

    try {
      user = await this.repository.getUserByEmail(email);

      isValid = await user.isValidPassword(password);
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    if (!isValid) {
      throw new WrongPasswordError();
    }

    const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

    return { token, user };
  };

  signup = async (email: string, password: string): Promise<{ token: string; user: UserModel }> => {
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });

    const userRole = await RoleModel.findOne({
      where: {
        role: 'user',
      },
    });

    if (user) {
      throw new UserAlreadyExistsError();
    }

    if (!userRole) {
      throw new BadRequestError();
    }

    try {
      const newUser = await UserModel.create({
        email,
        password,
        role_id: userRole.get('id'),
      });

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      const createdUser = await this.repository.getUserById(Number(newUser.get('id')));

      return { token, user: createdUser };
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
