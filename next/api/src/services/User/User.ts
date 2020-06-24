import { injectable, inject } from 'inversify';
import { BadRequest, SequelizeError, UserAlreadyExists, UserNotFound, WrongPassword } from '../../errors';
import { UserModel } from '../../models/User';
import { RoleModel } from '../../models/Role';
import { UserRepositoryDIType, UserRepositoryInterface } from '../../repositories/User';
import { createToken } from '../../utils/auth';
import { config } from '../../config';
import { logger } from '../../logger';
import { UserServiceInterface } from './interface';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(UserRepositoryDIType) private repository: UserRepositoryInterface,
  ) {
  }

  signup = async (email: string, password: string): Promise<{ user: UserModel; token: string }> => {
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

      const createdUser = await this.repository.getUserById(Number(newUser.get('id')));

      return { user: createdUser, token };
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  signin = async (email: string, password: string): Promise<{ user: UserModel; token: string }> => {
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
      throw new WrongPassword();
    }

    const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

    return { user, token };
  };

  deleteUser = async (id: number): Promise<void> => {
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
