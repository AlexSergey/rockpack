import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';
import { StatisticModel } from './Statistic';
import { StatisticTypeModel } from './StatisticType';
import { InternalError } from '../errors';

export interface CommentInterface {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  createdAt: Date;
}

export class CommentModel extends Model<CommentInterface> {}

CommentModel.init({
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
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id',
    }
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('NOW()')
  }
}, {
  tableName: 'comments',
  sequelize,
  hooks: {
    afterCreate: async (comment): Promise<void> => {
      const userType = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      const postType = await StatisticTypeModel.findOne({
        where: {
          type: 'post'
        }
      });

      try {
        await StatisticModel.update(
          {
            comments: Sequelize.literal('comments + 1')
          },
          {
            where: {
              type_id: userType.get('id'),
              entity_id: comment.get('user_id')
            }
          }
        );

        await StatisticModel.update(
          {
            comments: Sequelize.literal('comments + 1')
          },
          {
            where: {
              type_id: postType.get('id'),
              entity_id: comment.get('post_id')
            }
          }
        );
      } catch (e) {
        throw new InternalError();
      }
    },

    afterDestroy: async (comment): Promise<void> => {
      const userType = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      const postType = await StatisticTypeModel.findOne({
        where: {
          type: 'post'
        }
      });

      try {
        await StatisticModel.update(
          {
            comments: Sequelize.literal('comments - 1')
          },
          {
            where: {
              type_id: postType.get('id'),
              entity_id: comment.get('post_id')
            }
          }
        );

        await StatisticModel.update(
          {
            comments: Sequelize.literal('comments - 1')
          },
          {
            where: {
              type_id: userType.get('id'),
              entity_id: comment.get('user_id')
            }
          }
        );
      } catch (e) {
        throw new InternalError();
      }
    }
  }
});
