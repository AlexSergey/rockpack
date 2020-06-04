import { userFactory } from '../models/User';
import { roleFactory } from '../models/Role';
import { sequelize } from '../boundaries/database';
import { createToken } from '../utils/auth';
import { UserAlreadyExists, UserNotFound, SequelizeError, WrongPassword, BadRequest, InternalError } from '../errors';
import config from '../config';
import { ok } from '../utils/response';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);
    const Role = roleFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const user = await User.findOne({
      where: {
        email
      }
    });

    const userRole = await Role.findOne({
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
      const newUser = await User.create({
        email,
        password,
        role_id: userRole.get('id')
      });

      User.belongsTo(Role, { foreignKey: 'role_id' });
      User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
      StatisticUser.belongsTo(User, { foreignKey: 'id' });

      const createdUser = await User.findOne({
        limit: 1,
        where: {
          id: newUser.get('id')
        },
        include: [
          {
            model: StatisticUser,
            where: {
              type_id: userType.get('id')
            },
            required: false
          },
          {
            model: Role,
            attributes: {
              exclude: ['id']
            },
            required: false
          }
        ]
      });

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      ctx.cookies.set('token', token, { httpOnly: false });

      ctx.body = ok('User created', createdUser.toJSON());
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static userList = async (ctx): Promise<void> => {
    const User = userFactory(sequelize);
    const Role = roleFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const userRole = await Role.findOne({
      where: {
        role: 'user'
      }
    });

    if (!userRole) {
      throw new BadRequest();
    }

    try {
      User.belongsTo(Role, { foreignKey: 'role_id' });
      User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
      StatisticUser.belongsTo(User, { foreignKey: 'id' });

      const users = await User.findAll({
        attributes: {
          exclude: ['role_id']
        },
        include: [
          {
            model: StatisticUser,
            where: {
              type_id: userType.get('id')
            },
            required: false
          },
          {
            model: Role,
            attributes: {
              exclude: ['id']
            },
            required: false
          }
        ],
      });

      ctx.body = ok('Users list', { users: users.map(user => user.toJSON()) });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static authorization = async (ctx): Promise<void> => {
    const Role = roleFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const role = await Role.findOne({
      limit: 1,
      where: {
        id: ctx.user.get('role_id')
      }
    });

    const stats = await StatisticUser.findOne({
      limit: 1,
      where: {
        type_id: userType.get('id'),
        entity_id: ctx.user.get('id')
      },
    });

    ctx.body = ok('User is correct', {
      id: ctx.user.get('id'),
      email: ctx.user.get('email'),
      Role: {
        role: role.get('role')
      },
      Statistic: stats.toJSON()
    });
  };

  static signin = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const Role = roleFactory(sequelize);
    const User = userFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    User.belongsTo(Role, { foreignKey: 'role_id' });
    User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
    StatisticUser.belongsTo(User, { foreignKey: 'id' });

    const user = await User.findOne({
      limit: 1,
      where: {
        email
      },
      include: [
        {
          model: StatisticUser,
          where: {
            type_id: userType.get('id')
          },
          required: false
        },
        {
          model: Role,
          attributes: {
            exclude: ['id']
          },
          required: false
        }
      ],
      attributes: {
        include: ['password']
      }
    });

    if (!user) {
      throw new UserNotFound();
    }

    const isValid = await user.isValidPassword(user.get('password'), password);

    if (!isValid) {
      throw new WrongPassword();
    }

    const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

    ctx.cookies.set('token', token, { httpOnly: false });

    ctx.body = ok('User is logged in', user.toJSON());
  };

  static signout = async (ctx): Promise<void> => {
    ctx.cookies.set('token', '', { httpOnly: false });

    ctx.body = ok('User is logged out');
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const User = userFactory(sequelize);

    const user = await User.destroy({
      where: {
        id
      },
      individualHooks: true
    });

    if (!user) {
      throw new UserNotFound();
    }

    ctx.body = ok('User deleted');
  };
}
