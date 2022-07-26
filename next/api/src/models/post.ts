import sanitizeHtml from 'sanitize-html';
import { Sequelize, Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';
import { InternalError } from '../errors';
import { ALLOWED_TEXT } from '../utils/allowed-tags';
import { removeImages } from '../utils/remove-images';

import { CommentModel, IComment } from './comment';
import { ImageModel, IImage } from './image';
import { StatisticModel } from './statistic';
import { StatisticTypeModel } from './statistic-type';

export interface IPost {
  id: number;
  user_id: number;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostModel extends Model<IPost> {}

PostModel.init(
  {
    createdAt: {
      defaultValue: Sequelize.literal('NOW()'),
      type: DataTypes.DATE,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT({ length: 'long' }),
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    updatedAt: {
      defaultValue: Sequelize.literal('NOW()'),
      type: DataTypes.DATE,
    },
    user_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'users',
      },
      type: DataTypes.INTEGER,
    },
  },
  {
    hooks: {
      afterCreate: async (post): Promise<void> => {
        const postType = await StatisticTypeModel.findOne({
          where: {
            type: 'post',
          },
        });

        const userType = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        try {
          await StatisticModel.create({
            comments: 0,
            entity_id: post.get('id'),
            type_id: postType.get('id'),
          });

          await StatisticModel.update(
            {
              posts: Sequelize.literal('posts + 1'),
            },
            {
              where: {
                entity_id: post.get('user_id'),
                type_id: userType.get('id'),
              },
            },
          );
        } catch (e) {
          throw new InternalError();
        }
      },

      afterDestroy: async (post): Promise<void> => {
        const userType = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        const comments = await CommentModel.findAll({
          where: {
            post_id: post.get('id'),
          },
        });

        const userComments = comments
          .map((c) => c.toJSON() as IComment)
          .reduce((dict, comment) => {
            dict[comment.user_id] = typeof dict[comment.user_id] === 'number' ? dict[comment.user_id] + 1 : 1;

            return dict;
          }, {});

        try {
          const images = await ImageModel.findAll({
            where: {
              post_id: post.get('id'),
            },
          });

          await ImageModel.destroy({
            where: {
              post_id: post.get('id'),
            },
          });

          await CommentModel.destroy({
            where: {
              post_id: post.get('id'),
            },
          });

          await StatisticModel.update(
            {
              posts: Sequelize.literal('posts - 1'),
            },
            {
              where: {
                entity_id: post.get('user_id'),
                type_id: userType.get('id'),
              },
            },
          );

          if (images) {
            const imageLinks = images.map((img) => (img.toJSON() as IImage).uri);

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
            await StatisticModel.update(
              {
                posts: Sequelize.literal(`comments - ${userComments[userId]}`),
              },
              {
                where: {
                  entity_id: userId,
                  type_id: userType.get('id'),
                },
              },
            );
          } catch (e) {
            throw new InternalError();
          }
        }
      },

      beforeCreate: async (post): Promise<void> => {
        post.setAttributes({
          text: sanitizeHtml(post.get('text'), {
            allowedTags: ALLOWED_TEXT,
          }),
        });
      },
    },
    sequelize,
    tableName: 'posts',
  },
);
