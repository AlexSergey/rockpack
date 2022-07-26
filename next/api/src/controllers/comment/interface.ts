import { IKoaContext } from '../../types/koa.context';

export interface ICommentController {
  fetch(ctx: IKoaContext): Promise<void>;

  create(ctx: IKoaContext): Promise<void>;

  delete(ctx: IKoaContext): Promise<void>;

  update(ctx: IKoaContext): Promise<void>;
}
