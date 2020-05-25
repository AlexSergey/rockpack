import { userFactory } from '../models/User';
import { roleFactory } from '../models/Role';
import { sequelize } from '../boundaries/database';
import { createToken } from '../utils/auth';
import { UserAlreadyExists, UserNotFound, SequelizeError, WrongPassword, BadRequest } from '../errors';
import config from '../config';
import { ok } from '../utils/response';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const User = userFactory(sequelize);
    const Role = roleFactory(sequelize);

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

      const token = createToken(email, process.env.JWT_SECRET, config.jwtExpiresIn);

      ctx.cookies.set('token', token);

      ctx.body = ok('User created', {
        email: newUser.get('email'),
        role: userRole.get('role'),
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static check = async (ctx): Promise<void> => {
    console.log('check');
    const Role = roleFactory(sequelize);
    const role = await Role.findOne({
      limit: 1,
      where: {
        id: ctx.user.get('role_id')
      }
    });
    ctx.body = ok('User is correct', {
      email: ctx.user.get('email'),
      role: role.get('role')
    });
  };

  static signin = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    const Role = roleFactory(sequelize);
    const User = userFactory(sequelize);

    User.belongsTo(Role, { foreignKey: 'role_id' });

    const user = await User.findOne({
      limit: 1,
      where: {
        email
      },
      include: [
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
    console.log(token);
    ctx.cookies.set('token', token);

    const userData = user.toJSON();

    ctx.body = ok('User is logged in', {
      email: user.get('email'),
      role: userData.Role.role
    });
  };

  static signout = async (ctx): Promise<void> => {
    ctx.cookies.set('token', '');
    ctx.cookies.set('role', '');

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
