import sanitizeHtml from 'sanitize-html';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';
import { StatisticModel } from './Statistic';
import { StatisticTypeModel } from './StatisticType';
import { CommentModel } from './Comment';
import { InternalError } from '../errors';
import { ImageModel } from './Image';

import { removeImages } from '../utils/removeImages';

import { ALLOWED_TEXT } from '../utils/allowedTags';

export interface PostInterface {
  id: number;
  user_id: number;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostModel extends Model<PostInterface> { }

PostModel.init({
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
    defaultValue: Sequelize.literal('NOW()')
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('NOW()')
  }
}, {
  tableName: 'posts',
  sequelize,
  hooks: {
    beforeCreate: async (post): Promise<void> => {
      post.setAttributes({
        text: sanitizeHtml(post.get('text'), {
          allowedTags: ALLOWED_TEXT
        })
      });
    },

    afterCreate: async (post): Promise<void> => {
      const postType = await StatisticTypeModel.findOne({
        where: {
          type: 'post'
        }
      });

      const userType = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      try {
        await StatisticModel.create({
          type_id: postType.get('id'),
          entity_id: post.get('id'),
          comments: 0
        });

        await StatisticModel.update({
          posts: Sequelize.literal('posts + 1')
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
      const userType = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      const comments = await CommentModel.findAll({
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
        const images = await ImageModel.findAll({
          where: {
            post_id: post.get('id')
          }
        });

        await ImageModel.destroy({
          where: {
            post_id: post.get('id')
          }
        });

        await CommentModel.destroy({
          where: {
            post_id: post.get('id')
          }
        });

        await StatisticModel.update({
          posts: Sequelize.literal('posts - 1')
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
          await StatisticModel.update({
            posts: Sequelize.literal(`comments - ${userComments[userId]}`)
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
