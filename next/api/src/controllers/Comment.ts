import { sequelize } from '../boundaries/database';
import { BadRequest, InternalError, SequelizeError, CommentNotFound } from '../errors/errors';
import { commentFactory } from '../models/Comment';
import { ok } from '../utils/response';
import { userFactory } from '../models/User';
import { roleFactory } from '../models/Role';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';

export class CommentController {
  static fetch = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const User = userFactory(sequelize);
    const Role = roleFactory(sequelize);
    const Comment = commentFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    Comment.belongsTo(User, { foreignKey: 'user_id' });
    User.hasOne(StatisticUser, { foreignKey: 'id' });
    User.belongsTo(Role, { foreignKey: 'role_id' });

    const comments = await Comment.findAll({
      where: {
        post_id: postId
      },
      include: [
        {
          model: User,
          include: [
            {
              model: StatisticUser,
              where: {
                type_id: userType.get('id')
              },
              required: false
            },
            {
              model: Role,
              attributes: {
                exclude: ['id']
              },
              required: false
            }
          ],
          attributes: {
            exclude: ['role_id', 'password']
          }
        }
      ],
      attributes: {
        exclude: ['post_id', 'user_id']
      }
    });

    ctx.body = ok('Comments fetched', comments.map(c => c.toJSON()));
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
    const { id } = ctx.params;
    const Comment = commentFactory(sequelize);
    let status;
    try {
      status = await Comment.destroy({
        where: {
          id
        },
        individualHooks: true
      });
    } catch (e) {
      throw new SequelizeError(e);
    }

    if (!status) {
      throw new CommentNotFound();
    }

    ctx.body = ok('Comment deleted', {
      id
    });
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
