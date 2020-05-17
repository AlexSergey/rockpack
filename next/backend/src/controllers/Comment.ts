import { sequelize } from '../boundaries/database';
import { BadRequest, InternalError, SequelizeValidationError } from '../errors/errors';
import { commentFactory } from '../models/Comment';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';

export class CommentController {
  static fetch = async (ctx): Promise<void> => {
    const { postId } = ctx.params;

    const Comment = commentFactory(sequelize);

    const comments = await Comment.findOne({
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
    const Statistic = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    if (typeof text === 'undefined' || (text && text.length === 0)) {
      throw new BadRequest();
    }

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const postType = await StatisticType.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userStats = await Statistic.findOne({
      where: {
        type_id: userType.get('id'),
        entity_id: userId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    const postStats = await Statistic.findOne({
      where: {
        type_id: postType.get('id'),
        entity_id: postId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    try {
      const comment = await Comment.create({
        text,
        user_id: userId,
        post_id: postId
      });

      await Statistic.update(
        {
          comments: (postStats.get('comments') + 1)
        },
        {
          where: {
            type_id: postType.get('id'),
            entity_id: postId
          }
        }
      );

      await Statistic.update(
        {
          comments: (userStats.get('comments') + 1)
        },
        {
          where: {
            type_id: userType.get('id'),
            entity_id: postId
          }
        }
      );

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment created'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const userId = ctx.user.get('id');
    const Comment = commentFactory(sequelize);
    const Statistic = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const postType = await StatisticType.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userStats = await Statistic.findOne({
      where: {
        type_id: userType.get('id'),
        entity_id: userId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    const postStats = await Statistic.findOne({
      where: {
        type_id: postType.get('id'),
        entity_id: postId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    try {
      const comment = await Comment.destroy(
        {
          where: {
            user_id: userId,
            post_id: postId
          }
        }
      );

      await Statistic.update(
        {
          comments: (postStats.get('comments') - 1)
        },
        {
          where: {
            type_id: postType.get('id'),
            entity_id: postId
          }
        }
      );

      await Statistic.update(
        {
          comments: (userStats.get('comments') - 1)
        },
        {
          where: {
            type_id: userType.get('id'),
            entity_id: postId
          }
        }
      );

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment deleted'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };

  static update = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = ctx.user.get('id');
    const Comment = commentFactory(sequelize);
    const Statistic = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    if (typeof text === 'undefined') {
      throw new BadRequest();
    }

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const postType = await StatisticType.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userStats = await Statistic.findOne({
      where: {
        type_id: userType.get('id'),
        entity_id: userId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    const postStats = await Statistic.findOne({
      where: {
        type_id: postType.get('id'),
        entity_id: postId,
      }
    });

    if (!userStats) {
      throw new InternalError();
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

      await Statistic.update(
        {
          comments: (postStats.get('comments') + 1)
        },
        {
          where: {
            type_id: postType.get('id'),
            entity_id: postId
          }
        }
      );

      await Statistic.update(
        {
          comments: (userStats.get('comments') + 1)
        },
        {
          where: {
            type_id: userType.get('id'),
            entity_id: postId
          }
        }
      );

      ctx.body = {
        id: comment.get('id'),
        message: 'Comment updated'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };
}
