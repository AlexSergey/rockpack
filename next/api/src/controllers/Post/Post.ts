import { injectable, inject } from 'inversify';
import { PostRepositoryDIType } from '../../repositories/Post';
import type { PostRepositoryInterface } from '../../repositories/Post';
import { PostServiceDIType } from '../../services/Post';
import type { PostServiceInterface } from '../../services/Post';
import { SequelizeError, ErrorProxy } from '../../errors';
import { config } from '../../config';
import { ok } from '../../utils/response';
import { logger } from '../../logger';
import type { PostControllerInterface } from './interface';
import { KoaContext } from '../../types/koa.context';

@injectable()
export class PostController implements PostControllerInterface {
  constructor(
    @inject(PostRepositoryDIType) private repository: PostRepositoryInterface,
    @inject(PostServiceDIType) private service: PostServiceInterface,
  ) {
  }

  fetch = async (ctx: KoaContext): Promise<void> => {
    const page = typeof ctx.request.query.page === 'undefined' ?
      0 :
      Number(ctx.request.query.page) - 1;
    try {
      const { count, rows } = await this.repository.fetchPosts(page, config.postsLimit);

      ctx.body = ok('Posts fetched', {
        posts: rows.map(post => post.toJSON()),
        count
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  details = async (ctx: KoaContext): Promise<void> => {
    const { id } = ctx.params;

    try {
      const post = await this.repository.postDetails(Number(id));

      ctx.body = ok('Posts fetched', post.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  create = async (ctx: KoaContext): Promise<void> => {
    const userId = Number(ctx.user.get('id'));
    const { title, text } = ctx.request.body;

    try {
      const post = await this.service.createPost(userId, {
        title,
        text,
        preview: Array.isArray(ctx.files.preview) && ctx.files.preview[0],
        photos: Array.isArray(ctx.files.photos) && ctx.files.photos
      });

      ctx.body = ok('Post created', {
        id: post.get('id')
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  delete = async (ctx: KoaContext): Promise<void> => {
    const userId = Number(ctx.user.get('id'));
    const { id } = ctx.params;
    try {
      const comments = await this.service.deletePost(id, userId);

      const commentsId = Array.isArray(comments) ?
        comments.map(comment => comment.get('id')) : [];

      ctx.body = ok('Post deleted', { deleteComments: commentsId });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  update = async (ctx: KoaContext): Promise<void> => {
    const { id } = ctx.params;
    const { title, text } = ctx.request.body;
    try {
      await this.service.updatePost(id, {
        title,
        text
      });
      ctx.body = ok('Post updated');
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
