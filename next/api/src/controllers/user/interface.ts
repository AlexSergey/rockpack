import { IKoaContext } from '../../types/koa.context';

export interface IUserController {
  authorization(ctx: IKoaContext): Promise<void>;

  delete(ctx: IKoaContext): Promise<void>;

  signin(ctx: IKoaContext): Promise<void>;

  signout(ctx: IKoaContext): Promise<void>;

  signup(ctx: IKoaContext): Promise<void>;

  userList(ctx: IKoaContext): Promise<void>;
}
