import { userFactory } from '../models/User';
import { sequelize } from '../boundaries/database';
import { createToken } from '../utils/auth';
import { UserAlreadyExists, UserNotFound, SequelizeValidationError, WrongPassword } from '../errors';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);

    const user = await User.findOne({
      limit: 1,
      where: {
        email
      } });
    if (user) {
      throw new UserAlreadyExists();
    }
    try {
      const newUser = await User.create({
        email,
        password
      });
      const token = createToken(email, process.env.JWT_SECRET, '1hr');

      ctx.cookies.set('token', token);

      ctx.body = {
        id: newUser.get('id'),
        message: 'User created!'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
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
      }
    });

    if (!user) {
      throw new UserNotFound();
    }

    const isValid = await user.isValidPassword(user.password, password);

    if (!isValid) {
      throw new WrongPassword();
    }

    const token = createToken(email, process.env.JWT_SECRET, '1hr');

    ctx.cookies.set('token', token);

    ctx.body = {
      message: 'ok',
      code: 200,
      status: 200,
      statusCode: 200
    };
  };
}
