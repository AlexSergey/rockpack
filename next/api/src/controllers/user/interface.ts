import { KoaContext } from '../../types/koa.context';

export interface UserControllerInterface {
  authorization(ctx: KoaContext): Promise<void>;

  delete(ctx: KoaContext): Promise<void>;

  signin(ctx: KoaContext): Promise<void>;

  signout(ctx: KoaContext): Promise<void>;

  signup(ctx: KoaContext): Promise<void>;

  userList(ctx: KoaContext): Promise<void>;
}
