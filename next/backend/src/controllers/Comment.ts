import { sequelize } from '../boundaries/database';
import { BadRequest, SequelizeError } from '../errors/errors';
import { commentFactory } from '../models/Comment';

export class CommentController {
  static fetch = async (ctx): Promise<void> => {
    const { postId } = ctx.params;

    const Comment = commentFactory(sequelize);

    const comments = await Comment.findAll({
      where: {
        post_id: postId
      }
    });

    ctx.body = {
      data: comments.map(c => c.toJSON())
    };
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

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment created'
      };
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

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment deleted'
      };
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

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment updated'
      };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
