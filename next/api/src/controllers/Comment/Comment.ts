import { injectable, inject } from 'inversify';
import { ErrorProxy } from '../../errors';
import { ok } from '../../utils/response';
import { CommentRepositoryDIType } from '../../repositories/Comment';
import type { CommentRepositoryInterface } from '../../repositories/Comment';
import { CommentServiceDIType } from '../../services/Comment';
import type { CommentServiceInterface } from '../../services/Comment';
import { CommentControllerInterface } from './interface';
import { KoaContext } from '../../types/koa.context';

@injectable()
export class CommentController implements CommentControllerInterface {
  constructor(
    @inject(CommentRepositoryDIType) private repository: CommentRepositoryInterface,
    @inject(CommentServiceDIType) private service: CommentServiceInterface,
  ) {}

  fetch = async (ctx: KoaContext): Promise<void> => {
    const { postId } = ctx.params;

    try {
      const comments = await this.repository.fetchComments(Number(postId));

      ctx.body = ok('Comments fetched', comments.map(c => c.toJSON()));
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  create = async (ctx: KoaContext): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = Number(ctx.user.get('id'));

    try {
      const comment = await this.service.createComment(userId, postId, text);

      ctx.body = ok('Comment created', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  delete = async (ctx: KoaContext): Promise<void> => {
    const { id } = ctx.params;

    try {
      await this.service.deleteComment(id);

      ctx.body = ok('Comment deleted', {
        id
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  update = async (ctx: KoaContext): Promise<void> => {
    const { id } = ctx.params;
    const { text } = ctx.request.body;

    try {
      const [, comments] = await this.service.updateComment(id, text);

      ctx.body = ok('Comment updated', {
        id: comments[0].get('id')
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };
}
