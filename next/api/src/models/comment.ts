import { Sequelize, Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';
import { InternalError } from '../errors';

import { StatisticModel } from './statistic';
import { StatisticTypeModel } from './statistic-type';

export interface IComment {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  createdAt: Date;
}

export class CommentModel extends Model<IComment> {}

CommentModel.init(
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
    post_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'posts',
      },
      type: DataTypes.INTEGER,
    },
    text: {
      allowNull: false,
      type: DataTypes.STRING,
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
      afterCreate: async (comment): Promise<void> => {
        const userType = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        const postType = await StatisticTypeModel.findOne({
          where: {
            type: 'post',
          },
        });

        try {
          await StatisticModel.update(
            {
              comments: Sequelize.literal('comments + 1'),
            },
            {
              where: {
                entity_id: comment.get('user_id'),
                type_id: userType.get('id'),
              },
            },
          );

          await StatisticModel.update(
            {
              comments: Sequelize.literal('comments + 1'),
            },
            {
              where: {
                entity_id: comment.get('post_id'),
                type_id: postType.get('id'),
              },
            },
          );
        } catch (e) {
          throw new InternalError();
        }
      },

      afterDestroy: async (comment): Promise<void> => {
        const userType = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        const postType = await StatisticTypeModel.findOne({
          where: {
            type: 'post',
          },
        });

        try {
          await StatisticModel.update(
            {
              comments: Sequelize.literal('comments - 1'),
            },
            {
              where: {
                entity_id: comment.get('post_id'),
                type_id: postType.get('id'),
              },
            },
          );

          await StatisticModel.update(
            {
              comments: Sequelize.literal('comments - 1'),
            },
            {
              where: {
                entity_id: comment.get('user_id'),
                type_id: userType.get('id'),
              },
            },
          );
        } catch (e) {
          throw new InternalError();
        }
      },
    },
    sequelize,
    tableName: 'comments',
  },
);
