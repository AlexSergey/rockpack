import { IKoaContext } from '../../types/koa.context';

export interface IPostController {
  create(ctx: IKoaContext): Promise<void>;

  delete(ctx: IKoaContext): Promise<void>;

  details(ctx: IKoaContext): Promise<void>;

  fetch(ctx: IKoaContext): Promise<void>;

  update(ctx: IKoaContext): Promise<void>;
}
