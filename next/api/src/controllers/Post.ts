import { PostRepository } from '../repositories/Post';
import { PostService } from '../services/Post';
import { SequelizeError, ErrorProxy } from '../errors';
import { config } from '../config';
import { ok } from '../utils/response';
import { logger } from '../logger';

export class PostController {
  static fetch = async (ctx): Promise<void> => {
    const page = typeof ctx.request.query.page === 'undefined' ?
      0 :
      Number(ctx.request.query.page) - 1;
    try {
      const { count, rows } = await PostRepository.fetchPosts(page, config.postsLimit);

      ctx.body = ok('Posts fetched', {
        posts: rows.map(post => post.toJSON()),
        count
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static details = async (ctx): Promise<void> => {
    const { id } = ctx.params;

    try {
      const post = await PostRepository.postDetails(id);

      ctx.body = ok('Posts fetched', post.toJSON());
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static create = async (ctx): Promise<void> => {
    const userId = ctx.user.get('id');
    const { title, text } = ctx.request.body;

    try {
      const post = await PostService.createPost(userId, {
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

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    try {
      const comments = await PostService.deletePost(id, ctx.user.get('id'));

      const commentsId = Array.isArray(comments) ?
        comments.map(comment => comment.get('id')) : [];

      ctx.body = ok('Post deleted', { deleteComments: commentsId });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static update = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const { title, text } = ctx.request.body;
    try {
      await PostService.updatePost(id, {
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
