import { ErrorProxy } from '../errors';
import { ok } from '../utils/response';
import { UserRepository } from '../repositories/User';
import { UserService } from '../services/User';

export class UserController {
  static signup = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;

    try {
      const { user, token } = await UserService.signup(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });

      ctx.body = ok('User created', user.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static userList = async (ctx): Promise<void> => {
    try {
      const users = await UserRepository.getUsers();

      ctx.body = ok('Users list', { users: users.map(user => user.toJSON()) });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static authorization = async (ctx): Promise<void> => {
    ctx.body = ok('User is correct', ctx.user.toJSON());
  };

  static signin = async (ctx): Promise<void> => {
    const { email, password } = ctx.request.body;
    try {
      const { token, user } = await UserService.signin(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });
      ctx.body = ok('User is logged in', user.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static signout = async (ctx): Promise<void> => {
    ctx.cookies.set('token', '', { httpOnly: false });

    ctx.body = ok('User is logged out');
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;

    try {
      await UserService.deleteUser(id);

      ctx.body = ok('User deleted');
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };
}
