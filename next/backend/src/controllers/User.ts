import { userFactory } from '../models/User';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';
import { sequelize } from '../boundaries/database';
import { createToken } from '../utils/auth';
import { UserAlreadyExists, UserNotFound, SequelizeValidationError, WrongPassword, InternalError } from '../errors';
import config from '../config';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);
    const Statistic = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const typeEntity = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!typeEntity) {
      throw new InternalError();
    }

    const user = await User.findOne({
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

      await Statistic.create({
        type_id: typeEntity.get('id'),
        entity_id: newUser.get('id'),
        posts: 0,
        comment: 0
      });

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      ctx.cookies.set('token', token);

      ctx.body = {
        id: newUser.get('id'),
        message: 'User created'
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
