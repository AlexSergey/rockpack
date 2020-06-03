import sanitizeHtml from 'sanitize-html';
import { Model, DataTypes } from 'sequelize';
import { statisticFactory } from './Statistic';
import { statisticTypeFactory } from './StatisticType';
import { commentFactory } from './Comment';
import { InternalError } from '../errors';
import { imageFactory } from './Image';
import { removeImages } from '../utils/removeImages';

import { ALLOWED_TEXT } from '../utils/allowedTags';
import { imageTypeFactory } from './ImageType';

export interface PostInterface {
  id: number;
  user_id: number;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const postFactory = (sequelize) => {
  class Post extends Model<PostInterface> {
    savePreviewLink = async (ctx, postId): Promise<void> => {
      const Image = imageFactory(sequelize);
      const ImageType = imageTypeFactory(sequelize);

      if (ctx.files.preview && Array.isArray(ctx.files.preview)) {
        const preview = ctx.files.preview[0];

        const previewType = await ImageType.findOne({
          where: {
            type: 'preview'
          }
        });

        await Image.create({
          post_id: postId,
          type_id: previewType.get('id'),
          uri: preview.filename
        });
      }
    };

    savePhotoLinks = async (ctx, postId): Promise<void> => {
      const Image = imageFactory(sequelize);
      const ImageType = imageTypeFactory(sequelize);

      if (ctx.files.photos && Array.isArray(ctx.files.photos)) {
        const photosType = await ImageType.findOne({
          where: {
            type: 'photos'
          }
        });

        for (let i = 0, l = ctx.files.photos.length; i < l; i++) {
          const photo = ctx.files.photos[i];

          await Image.create({
            post_id: postId,
            type_id: photosType.get('id'),
            uri: photo.filename
          });
        }
      }
    };
  }

  Post.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    tableName: 'posts',
    sequelize,
    hooks: {
      beforeCreate: async (post): Promise < void > => {
        post.setAttributes({
          text: sanitizeHtml(post.get('text'), {
            allowedTags: ALLOWED_TEXT
          })
        });
      },

      afterCreate: async (post): Promise<void> => {
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const postType = await StatisticType.findOne({
          where: {
            type: 'post'
          }
        });

        const userType = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        try {
          await Statistic.create({
            type_id: postType.get('id'),
            entity_id: post.get('id'),
            comments: 0
          });

          await Statistic.update({
            posts: sequelize.literal('posts + 1')
          }, {
            where: {
              type_id: userType.get('id'),
              entity_id: post.get('user_id'),
            }
          });
        } catch (e) {
          throw new InternalError();
        }
      },

      afterDestroy: async (post): Promise<void> => {
        const Image = imageFactory(sequelize);
        const Comment = commentFactory(sequelize);
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const userType = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        const comments = await Comment.findAll({
          where: {
            post_id: post.get('id')
          }
        });

        const userComments = comments
          .map(c => c.toJSON())
          .reduce((dict, comment) => {
            dict[comment.user_id] = typeof dict[comment.user_id] === 'number' ?
              dict[comment.user_id] + 1 :
              1;
            return dict;
          }, {});

        try {
          const images = await Image.findAll({
            where: {
              post_id: post.get('id')
            }
          });

          await Image.destroy({
            where: {
              post_id: post.get('id')
            }
          });

          await Comment.destroy({
            where: {
              post_id: post.get('id')
            }
          });

          await Statistic.update({
            posts: sequelize.literal('posts - 1')
          }, {
            where: {
              type_id: userType.get('id'),
              entity_id: post.get('user_id'),
            }
          });

          if (images) {
            const imageLinks = images.map(img => img.toJSON().uri);

            if (imageLinks.length > 0) {
              removeImages(imageLinks);
            }
          }
        } catch (e) {
          throw new InternalError();
        }

        const userIds = Object.keys(userComments);

        for (let i = 0, l = userIds.length; i < l; i++) {
          const userId = userIds[i];
          try {
            await Statistic.update({
              posts: sequelize.literal(`comments - ${userComments[userId]}`)
            }, {
              where: {
                type_id: userType.get('id'),
                entity_id: userId,
              }
            });
          } catch (e) {
            throw new InternalError();
          }
        }
      }
    }
  });

  Post.sync();

  return Post;
};
