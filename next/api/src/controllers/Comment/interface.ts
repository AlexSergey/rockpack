import { KoaContext } from '../../types/koa.context';

export interface CommentControllerInterface {
  fetch(ctx: KoaContext): Promise<void>;

  create(ctx: KoaContext): Promise<void>;

  delete(ctx: KoaContext): Promise<void>;

  update(ctx: KoaContext): Promise<void>;
}
