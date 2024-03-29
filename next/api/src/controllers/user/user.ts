import { inject, injectable } from 'inversify';

import type { IUserRepository } from '../../repositories/user';
import type { IUserService } from '../../services/user';

import { ErrorProxyError } from '../../errors';
import { UserRepositoryDIType } from '../../repositories/user';
import { UserServiceDIType } from '../../services/user';
import { IKoaContext } from '../../types/koa.context';
import { ok } from '../../utils/response';
import { IUserController } from './interface';

@injectable()
export class UserController implements IUserController {
  authorization = async (ctx: IKoaContext): Promise<void> => {
    ctx.body = ok('User is correct', ctx.user.toJSON());
  };

  delete = async (ctx: IKoaContext): Promise<void> => {
    const { id } = ctx.params;

    try {
      await this.service.deleteUser(id);

      ctx.body = ok('User deleted');
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  signin = async (ctx: IKoaContext): Promise<void> => {
    const { email, password } = ctx.request.body;
    try {
      const { token, user } = await this.service.signin(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });
      ctx.body = ok('User is logged in', user.toJSON());
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  signout = async (ctx: IKoaContext): Promise<void> => {
    ctx.cookies.set('token', '', { httpOnly: false });

    ctx.body = ok('User is logged out');
  };

  signup = async (ctx: IKoaContext): Promise<void> => {
    const { email, password } = ctx.request.body;

    try {
      const { token, user } = await this.service.signup(email, password);

      ctx.cookies.set('token', token, { httpOnly: false });

      ctx.body = ok('User created', user.toJSON());
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  userList = async (ctx: IKoaContext): Promise<void> => {
    try {
      const users = await this.repository.getUsers();

      ctx.body = ok('Users list', { users: users.map((user) => user.toJSON()) });
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  constructor(
    @inject(UserRepositoryDIType) private repository: IUserRepository,
    @inject(UserServiceDIType) private service: IUserService,
  ) {}
}
