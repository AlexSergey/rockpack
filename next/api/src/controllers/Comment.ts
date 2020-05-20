import { sequelize } from '../boundaries/database';
import { BadRequest, SequelizeError } from '../errors/errors';
import { commentFactory } from '../models/Comment';
import { ok } from '../utils/response';

export class CommentController {
  static fetch = async (ctx): Promise<void> => {
    const { postId } = ctx.params;

    const Comment = commentFactory(sequelize);

    const comments = await Comment.findAll({
      where: {
        post_id: postId
      }
    });

    ctx.body = ok('Comments fetched', {
      comments: comments.map(c => c.toJSON())
    });
  };

  static create = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = ctx.user.get('id');
    const Comment = commentFactory(sequelize);

    if (typeof text === 'undefined' || (text && text.length === 0)) {
      throw new BadRequest();
    }

    try {
      const comment = await Comment.create({
        text,
        user_id: userId,
        post_id: postId
      });

      ctx.body = ok('Comment created', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const userId = ctx.user.get('id');
    const Comment = commentFactory(sequelize);

    try {
      const comment = await Comment.destroy({
        where: {
          user_id: userId,
          post_id: postId
        },
        individualHooks: true
      });

      ctx.body = ok('Comment deleted', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static update = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = ctx.user.get('id');
    const Comment = commentFactory(sequelize);

    if (typeof text === 'undefined') {
      throw new BadRequest();
    }

    try {
      const comment = await Comment.update(
        {
          text
        }, {
          where: {
            user_id: userId,
            post_id: postId
          }
        }
      );

      ctx.body = ok('Comment updated', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
