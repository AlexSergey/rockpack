import { inject, injectable } from 'inversify';

import type { IPostRepository } from '../../repositories/post';
import type { IPostService } from '../../services/post';
import type { IPostController } from './interface';

import { config } from '../../config';
import { ErrorProxyError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { PostRepositoryDIType } from '../../repositories/post';
import { PostServiceDIType } from '../../services/post';
import { IKoaContext } from '../../types/koa.context';
import { ok } from '../../utils/response';

@injectable()
export class PostController implements IPostController {
  create = async (ctx: IKoaContext): Promise<void> => {
    const userId = Number(ctx.user.get('id'));
    const { text, title } = ctx.request.body;

    try {
      const post = await this.service.createPost(userId, {
        photos: Array.isArray(ctx.files.photos) && ctx.files.photos,
        preview: Array.isArray(ctx.files.preview) && ctx.files.preview[0],
        text,
        title,
      });

      ctx.body = ok('Post created', {
        id: post.get('id'),
      });
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  delete = async (ctx: IKoaContext): Promise<void> => {
    const userId = Number(ctx.user.get('id'));
    const { id } = ctx.params;
    try {
      const comments = await this.service.deletePost(id, userId);

      const commentsId = Array.isArray(comments) ? comments.map((comment) => comment.get('id')) : [];

      ctx.body = ok('Post deleted', { deleteComments: commentsId });
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  details = async (ctx: IKoaContext): Promise<void> => {
    const { id } = ctx.params;

    try {
      const post = await this.repository.postDetails(Number(id));

      ctx.body = ok('Posts fetched', post.toJSON());
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  fetch = async (ctx: IKoaContext): Promise<void> => {
    const page = typeof ctx.request.query.page === 'undefined' ? 0 : Number(ctx.request.query.page) - 1;
    try {
      const { count, rows } = await this.repository.fetchPosts(page, config.postsLimit);

      ctx.body = ok('Posts fetched', {
        count,
        posts: rows.map((post) => post.toJSON()),
      });
    } catch (e) {
      throw new ErrorProxyError(e);
    }
  };

  update = async (ctx: IKoaContext): Promise<void> => {
    const { id } = ctx.params;
    const { text, title } = ctx.request.body;
    try {
      await this.service.updatePost(id, {
        text,
        title,
      });
      ctx.body = ok('Post updated');
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  constructor(
    @inject(PostRepositoryDIType) private repository: IPostRepository,
    @inject(PostServiceDIType) private service: IPostService,
  ) {}
}
