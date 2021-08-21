import { injectable, inject } from 'inversify';
import { ErrorProxy } from '../../errors';
import { ok } from '../../utils/response';
import { UserServiceDIType } from '../../services/User';
import type { UserServiceInterface } from '../../services/User';
import { UserControllerInterface } from './interface';
import { UserRepositoryDIType } from '../../repositories/User';
import type { UserRepositoryInterface } from '../../repositories/User';
import { KoaContext } from '../../types/koa.context';

@injectable()
export class UserController implements UserControllerInterface {
  constructor(
    @inject(UserRepositoryDIType) private repository: UserRepositoryInterface,
    @inject(UserServiceDIType) private service: UserServiceInterface,
  ) {
  }

  signup = async (ctx: KoaContext): Promise<void> => {
    const { email, password } = ctx.request.body;

    try {
      const { user, token } = await this.service.signup(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });

      ctx.body = ok('User created', user.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  userList = async (ctx: KoaContext): Promise<void> => {
    try {
      const users = await this.repository.getUsers();

      ctx.body = ok('Users list', { users: users.map(user => user.toJSON()) });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  authorization = async (ctx: KoaContext): Promise<void> => {
    ctx.body = ok('User is correct', ctx.user.toJSON());
  };

  signin = async (ctx: KoaContext): Promise<void> => {
    const { email, password } = ctx.request.body;
    try {
      const { token, user } = await this.service.signin(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });
      ctx.body = ok('User is logged in', user.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  signout = async (ctx: KoaContext): Promise<void> => {
    ctx.cookies.set('token', '', { httpOnly: false });

    ctx.body = ok('User is logged out');
  };

  delete = async (ctx: KoaContext): Promise<void> => {
    const { id } = ctx.params;

    try {
      await this.service.deleteUser(id);

      ctx.body = ok('User deleted');
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };
}
