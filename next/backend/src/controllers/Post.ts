import { sequelize } from '../boundaries/database';
import { userFactory } from '../models/User';
import { postFactory } from '../models/Post';
import { commentFactory } from '../models/Comment';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';
import { SequelizeValidationError, InternalError, PostNotFound, BadRequest } from '../errors';
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
        ]
      });

      ctx.body = {
        data: posts.map(p => p.toJSON())
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };

  static create = async (ctx): Promise<void> => {
    const userId = ctx.user.get('id');
    const { title, text } = ctx.request.body;
    const Post = postFactory(sequelize);
    const Statistic = statisticFactory(sequelize);
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

    const userStats = await Statistic.findOne({
      where: {
        type_id: userType.get('id'),
        entity_id: userId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    const postTypeId = postType.get('id');

    try {
      const post = await Post.create({
        user_id: userId, title, text
      });
      await Statistic.create({
        type_id: postTypeId,
        entity_id: post.get('id'),
        comments: 0
      });
      const postsCount = userStats.get('posts');
      await userStats.update({
        posts: (postsCount + 1)
      });
      ctx.body = {
        id: post.get('id'),
        message: 'Post created'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const userId = ctx.user.get('id');
    const Post = postFactory(sequelize);
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

    const userStats = await Statistic.findOne({
      where: {
        type_id: userType.get('id'),
        entity_id: userId,
      }
    });

    if (!userStats) {
      throw new InternalError();
    }

    let res;

    try {
      res = await Post.destroy({
        where: {
          id
        }
      });
    } catch (e) {
      throw new SequelizeValidationError(e);
    }

    if (!res) {
      throw new PostNotFound();
    }

    const comments = await Comment.findAll({
      where: {
        post_id: id
      }
    });

    try {
      await Comment.destroy({
        where: {
          post_id: id
        }
      });
    } catch (e) {
      throw new SequelizeValidationError(e);
    }

    try {
      const postsCount = userStats.get('posts');
      const userComments = comments
        .map(c => c.toJSON())
        .reduce((dict, comment) => {
          dict[comment.user_id] = typeof dict[comment.user_id] === 'number' ?
            dict[comment.user_id] + 1 :
            0;
          return dict;
        }, {});
      // TODO: update stats for user's comments here!
      console.log(userComments);

      await userStats.update({
        posts: (postsCount - 1)
      });
      ctx.body = {
        message: 'Post deleted'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
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

      await post.update(commit);

      ctx.body = {
        message: 'Post updated'
      };
    } catch (e) {
      throw new SequelizeValidationError(e);
    }
  };
}
