import { userFactory } from '../models/User';
import { sequelize } from '../boundaries/database';
import { createToken } from '../utils/auth';
import { UserAlreadyExists, UserNotFound, SequelizeError, WrongPassword } from '../errors';
import config from '../config';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);

    const user = await User.findOne({
      where: {
        email
      }
    });

    if (user) {
      throw new UserAlreadyExists();
    }

    try {
      const newUser = await User.create({
        email,
        password
      });

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      ctx.cookies.set('token', token);

      ctx.body = {
        id: newUser.get('id'),
        message: 'User created'
      };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static checkToken = async (ctx): Promise<void> => {
    ctx.body = {
      message: 'ok',
      code: 200,
      status: 200,
      statusCode: 200
    };
  };

  static signin = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);

    const user = await User.findOne({
      limit: 1,
      where: {
        email
      },
      attributes: {
        include: ['password']
      }
    });

    if (!user) {
      throw new UserNotFound();
    }

    const isValid = await user.isValidPassword(user.password, password);

    if (!isValid) {
      throw new WrongPassword();
    }

    const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

    ctx.cookies.set('token', token);

    ctx.body = {
      message: 'ok',
      code: 200,
      status: 200,
      statusCode: 200
    };
  };

  static signout = async (ctx): Promise<void> => {
    ctx.cookies.set('token', '');
  };
}
