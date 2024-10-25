import { KoaContext } from '../../types/koa.context';

export interface CommentControllerInterface {
  create(ctx: KoaContext): Promise<void>;

  delete(ctx: KoaContext): Promise<void>;

  fetch(ctx: KoaContext): Promise<void>;

  update(ctx: KoaContext): Promise<void>;
}
