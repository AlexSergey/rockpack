import Sequelize from 'sequelize';
import { sequelize } from '../boundaries/database';
import { userFactory } from '../models/User';
import { postFactory } from '../models/Post';
import { imageFactory } from '../models/Image';
import { statisticFactory } from '../models/Statistic';
import { statisticTypeFactory } from '../models/StatisticType';
import { imageTypeFactory } from '../models/ImageType';
import { SequelizeError, InternalError, PostNotFound, BadRequest } from '../errors';
import config from '../config';
import { ok } from '../utils/response';
import { roleFactory } from '../models/Role';
import { commentFactory } from '../models/Comment';

export class PostController {
  static fetch = async (ctx): Promise<void> => {
    const page = typeof ctx.request.query.page === 'undefined' ?
      0 :
      Number(ctx.request.query.page) - 1;

    const offset = page * config.postsLimit;
    const User = userFactory(sequelize);
    const Post = postFactory(sequelize);
    const Role = roleFactory(sequelize);
    const StatisticPost = statisticFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);
    const Image = imageFactory(sequelize);
    const ImageType = imageTypeFactory(sequelize);

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

    const previewType = await ImageType.findOne({
      where: {
        type: 'preview'
      }
    });

    if (!userType) {
      throw new InternalError();
    }
    if (!previewType) {
      throw new InternalError();
    }

    try {
      const { count } = await Post.findAndCountAll();

      Post.belongsTo(User, { foreignKey: 'user_id' });
      User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
      StatisticUser.belongsTo(User, { foreignKey: 'id' });
      User.belongsTo(Role, { foreignKey: 'role_id' });
      StatisticPost.belongsTo(User, { foreignKey: 'id' });
      Post.hasOne(StatisticPost, { foreignKey: 'entity_id' });
      Image.hasMany(Post, { foreignKey: 'id' });
      Post.hasOne(Image, { foreignKey: 'post_id' });

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
              exclude: ['password', 'role_id']
            }
          },
          {
            model: StatisticPost,
            where: {
              type_id: postType.get('id')
            },
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts']
            },
            required: false
          },
          {
            model: Image,
            where: {
              type_id: previewType.get('id')
            },
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')), 'thumbnail']
              ],
            },
            required: false
          }
        ],
        attributes: {
          exclude: ['user_id', 'text']
        },
        order: [
          ['createdAt', 'DESC']
        ],
      });

      ctx.body = ok('Posts fetched', {
        posts: posts.map(p => p.toJSON()),
        count
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static details = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const User = userFactory(sequelize);
    const Post = postFactory(sequelize);
    const Role = roleFactory(sequelize);
    const StatisticPost = statisticFactory(sequelize);
    const StatisticUser = statisticFactory(sequelize);
    const StatisticType = statisticTypeFactory(sequelize);
    const Image = imageFactory(sequelize);
    const ImageType = imageTypeFactory(sequelize);

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

    const photosType = await ImageType.findOne({
      where: {
        type: 'photos'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    if (!photosType) {
      throw new InternalError();
    }

    Post.belongsTo(User, { foreignKey: 'user_id' });
    User.hasOne(StatisticUser, { foreignKey: 'entity_id' });
    StatisticUser.belongsTo(User, { foreignKey: 'id' });
    User.belongsTo(Role, { foreignKey: 'role_id' });
    StatisticPost.belongsTo(User, { foreignKey: 'id' });
    Post.hasOne(StatisticPost, { foreignKey: 'entity_id' });
    Image.hasMany(Post, { foreignKey: 'id' });
    Post.hasMany(Image, { foreignKey: 'post_id' });

    try {
      const post = await Post.findOne({
        limit: 1,
        where: {
          id
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
              exclude: ['password']
            }
          },
          {
            model: StatisticPost,
            where: {
              type_id: postType.get('id')
            },
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts']
            },
            required: false
          },
          {
            model: Image,
            where: {
              type_id: photosType.get('id')
            },
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')), 'thumbnail']
              ],
            },
            required: false
          }
        ],
        attributes: {
          exclude: ['user_id']
        }
      });

      ctx.body = ok('Posts fetched', post.toJSON());
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static create = async (ctx): Promise<void> => {
    const userId = ctx.user.get('id');
    const Post = postFactory(sequelize);
    const { title, text } = ctx.request.body;

    try {
      const post = await Post.create({
        user_id: userId, title, text
      });
      await post.savePreviewLink(ctx, post.get('id'));
      await post.savePhotoLinks(ctx, post.get('id'));

      ctx.body = ok('Post created', {
        id: post.get('id')
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;
    const Post = postFactory(sequelize);
    const Comment = commentFactory(sequelize);

    let commentIds;

    try {
      const comments = await Comment.findAll({
        where: {
          post_id: id,
          user_id: ctx.user.get('id')
        },
      });
      commentIds = comments.map(comment => comment.get('id'));
    } catch (e) {
      throw new SequelizeError(e);
    }

    const post = await Post.destroy({
      where: {
        id
      },
      individualHooks: true
    });

    if (!post) {
      throw new PostNotFound();
    }

    ctx.body = ok('Post deleted', { deleteComments: commentIds });
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

      ctx.body = ok('Post updated');
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
