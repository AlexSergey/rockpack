import { sequelize } from '../boundaries/database';
import { userFactory } from '../models/User';
import { postFactory } from '../models/Post';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';
import { SequelizeError, InternalError, PostNotFound, BadRequest } from '../errors';
import config from '../config';

export class PostController {
  static fetch = async (ctx): Promise<void> => {
    const page = typeof ctx.request.query.page === 'undefined' ?
      0 :
      Number(ctx.request.query.page) - 1;

    const offset = page * config.postsLimit;
    const User = userFactory(sequelize);
    const Post = postFactory(sequelize);
    const StatisticPost = statisticFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);

    const postType = await StatisticType.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userType = await StatisticType.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    User.hasMany(Post, { foreignKey: 'id' });
    Post.belongsTo(User, { foreignKey: 'user_id' });
    StatisticUser.hasMany(User, { foreignKey: 'id' });
    User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
    StatisticPost.hasMany(Post, { foreignKey: 'id' });
    Post.hasOne(StatisticPost, { foreignKey: 'entity_id' });

    try {
      const posts = await Post.findAll({
        offset,
        limit: config.postsLimit,
        include: [
          {
            model: User,
            include: [
              {
                model: StatisticUser,
                where: {
                  type_id: userType.get('id')
                }
              }
            ]
          },
          {
            model: StatisticPost,
            where: {
              type_id: postType.get('id')
            },
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts']
            }
          }
        ],
        attributes: {
          exclude: ['user_id']
        }
      });

      ctx.body = {
        data: posts.map(p => p.toJSON())
      };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static create = async (ctx): Promise<void> => {
    const userId = ctx.user.get('id');
    const { title, text } = ctx.request.body;
    const Post = postFactory(sequelize);

    try {
      const post = await Post.create({
        user_id: userId, title, text
      });

      ctx.body = {
        id: post.get('id'),
        message: 'Post created'
      };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const Post = postFactory(sequelize);

    const post = await Post.destroy({
      where: {
        id
      },
      individualHooks: true
    });

    if (!post) {
      throw new PostNotFound();
    }

    ctx.body = {
      message: 'Post deleted'
    };
  };

  static update = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const { title, text } = ctx.request.body;

    if (typeof title === 'undefined' && typeof text === 'undefined') {
      throw new BadRequest();
    }

    const Post = postFactory(sequelize);

    const post = await Post.findOne({
      where: {
        id
      }
    });

    if (!post) {
      throw new PostNotFound();
    }

    try {
      const commit: { [key: string]: string } = {};

      if (typeof title === 'string' && title.length > 0) {
        commit.title = title;
      }
      if (typeof text === 'string' && text.length > 0) {
        commit.text = text;
      }

      await Post.update(commit, {
        where: {
          id
        }
      });

      ctx.body = {
        message: 'Post updated'
      };
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
